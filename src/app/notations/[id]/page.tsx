import React, { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  useGetNotationByIdQuery,
  useDeleteNotationMutation,
} from '@/store/api';
import { NotationSheetPreview } from '@/components/notation/NotationSheetPreview';
import { NotationNavbar } from '@/components/notation/NotationNavbar';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Share2,
  Printer,
  Sparkles,
  Loader2,
  Check,
  Music,
  Lock,
} from 'lucide-react';
import { toast } from 'sonner';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function NotationDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  const authUser = useSelector((state: RootState) => state.auth.user);
  const [copied, setCopied] = useState(false);

  const { data: notation, isLoading, error } = useGetNotationByIdQuery(id);
  const [deleteNotation, { isLoading: isDeleting }] = useDeleteNotationMutation();

  const currentUserId = authUser?.id || (authUser as any)?._id;
  const notationUserId =
    typeof notation?.userId === 'object' && notation?.userId !== null
      ? (notation.userId as any)._id || (notation.userId as any).id
      : notation?.userId;

  const isOwner = Boolean(
    currentUserId &&
    notationUserId &&
    String(notationUserId) === String(currentUserId)
  );

  const handleCopyShareLink = () => {
    if (!notation?.shareId) return;
    const url = `${window.location.origin}/notations/share/${notation.shareId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Public share link copied to clipboard!');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDelete = async () => {
    if (!notation) return;
    if (!confirm(`Are you sure you want to delete "${notation.name}"?`)) return;

    try {
      await deleteNotation(id).unwrap();
      toast.success('Notation deleted successfully');
      router.push('/notations');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete notation');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center animate-pulse">
            <Music size={24} />
          </div>
          <Loader2 className="animate-spin text-amber-500" size={24} />
          <p className="text-xs text-slate-500 font-bold tracking-wide">
            Rendering Sheet Music...
          </p>
        </div>
      </div>
    );
  }

  if (error || !notation) {
    if (!authUser) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 border border-amber-200 dark:border-amber-900/60 flex items-center justify-center mb-4 shadow-md">
            <Lock size={28} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 font-serif">
            Member Access Required
          </h2>
          <p className="text-sm text-slate-500 mt-2 mb-6 max-w-md leading-relaxed">
            This notation is part of a private account. If you are the author, please sign in to view and manage it. If you were sent a public share link, open the link directly.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href={`/login?redirectTo=/notations/${id}`}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/"
              className="px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-200 active:scale-95 transition-all"
            >
              Return Home
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mb-4">
          <Music size={28} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 font-serif">
          Notation Not Found
        </h2>
        <p className="text-sm text-slate-500 mt-2 mb-6 max-w-sm">
          The requested notation could not be loaded or may have been deleted.
        </p>
        <Link
          href="/notations"
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold shadow-md active:scale-95 transition-all"
        >
          Return to Notations
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-amber-500 selection:text-white">
      {/* Top Navbar with Home link, Breadcrumbs, Actions and ThemeToggle */}
      <NotationNavbar breadcrumbs={[{ label: notation.name }]}>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleCopyShareLink}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs transition-all active:scale-95"
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Share2 size={14} />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share'}</span>
          </button>

          {isOwner && (
            <>
              <Link
                href={`/notations/${notation._id}/edit`}
                className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs transition-all active:scale-95"
              >
                <Edit size={14} />
                <span className="hidden sm:inline">Edit</span>
              </Link>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 transition-all active:scale-95 disabled:opacity-50"
                title="Delete Notation"
              >
                <Trash2 size={14} />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-md shadow-amber-500/20 active:scale-95 transition-all"
          >
            <Printer size={16} />
            <span>PDF</span>
          </button>
        </div>
      </NotationNavbar>

      {/* Main Sheet Display */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-8 flex justify-center">
        <NotationSheetPreview
          title={notation.name}
          raag={notation.raag}
          time={notation.time}
          aroh={notation.aroh}
          avroh={notation.avroh}
          vaadi={notation.vaadi}
          samvaadi={notation.samvaadi}
          taal={notation.taal}
          sections={notation.sections}
          shabad={notation.shabad}
          showPrintActions={false}
        />
      </main>
    </div>
  );
}
