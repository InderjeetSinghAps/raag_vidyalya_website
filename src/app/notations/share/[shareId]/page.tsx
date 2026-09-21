'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { useGetNotationByShareIdQuery } from '@/store/api';
import { NotationSheetPreview } from '@/components/notation/NotationSheetPreview';
import { NotationNavbar } from '@/components/notation/NotationNavbar';
import {
  Printer,
  Sparkles,
  Loader2,
  Music,
  Share2,
  Check,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';

interface PageProps {
  params: Promise<{ shareId: string }>;
}

export default function PublicShareNotationPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const shareId = resolvedParams.shareId;
  const [copied, setCopied] = useState(false);

  const { data: notation, isLoading, error } = useGetNotationByShareIdQuery(shareId);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Share link copied to clipboard!');
  };

  const handlePrint = () => {
    window.print();
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
            Loading Shared Notation...
          </p>
        </div>
      </div>
    );
  }

  if (error || !notation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
          <Music size={28} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 font-serif">
          Notation Not Found
        </h2>
        <p className="text-sm text-slate-500 mt-2 mb-6 max-w-sm">
          This shared notation is either private, expired, or does not exist.
        </p>
        <Link
          href="/"
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold shadow-md active:scale-95 transition-all"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-amber-500 selection:text-white">
      {/* Top Navbar with Home link, Breadcrumbs, Actions and ThemeToggle */}
      <NotationNavbar
        hideNotationsLink={true}
        breadcrumbs={[
          { label: 'Public Sheet' },
          { label: notation.name },
        ]}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs transition-all active:scale-95"
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Share2 size={14} />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-md shadow-amber-500/20 active:scale-95 transition-all"
          >
            <Printer size={16} />
            <span>PDF</span>
          </button>

          <Link
            href="/notations/create"
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl border border-amber-500/30 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-all"
          >
            <Sparkles size={14} />
            <span>Compose</span>
          </Link>
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
