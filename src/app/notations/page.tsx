'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  useGetMyNotationsQuery,
  useDeleteNotationMutation,
} from '@/store/api';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  Music,
  Plus,
  Search,
  Printer,
  Edit,
  Trash2,
  Share2,
  Calendar,
  Layers,
  Sparkles,
  BookOpen,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';

import { NotationNavbar } from '@/components/notation/NotationNavbar';

export default function NotationsDashboardPage() {
  const authUser = useSelector((state: RootState) => state.auth.user);
  const [search, setSearch] = useState('');

  const {
    data,
    isLoading,
    refetch,
  } = useGetMyNotationsQuery({ search });

  const [deleteNotation, { isLoading: isDeleting }] = useDeleteNotationMutation();

  const notations = data?.notations || [];

  const handleCopyShareLink = (shareId: string) => {
    const url = `${window.location.origin}/notations/share/${shareId}`;
    navigator.clipboard.writeText(url);
    toast.success('Public share link copied to clipboard!');
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await deleteNotation(id).unwrap();
      toast.success('Notation deleted successfully');
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete notation');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-amber-500 selection:text-white">
      {/* Top Navbar with Home, Logo and ThemeToggle */}
      <NotationNavbar>
        <Link
          href="/notations/create"
          className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-xs hover:brightness-110 active:scale-95 transition-all"
        >
          <Plus size={15} />
          <span>New Bandish</span>
        </Link>
      </NotationNavbar>

      {/* Hero Banner with ambient gradient glow */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-gradient-to-tr from-cyan-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold tracking-wide">
                <Sparkles size={14} className="text-amber-500" />
                <span>Gurmat Sangeet Sheet Music Studio</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-slate-50 tracking-tight font-serif">
                Musical Notations & Bandish Library
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                Compose, organize, and export print-ready Indian Classical & Gurmat Sangeet sheet music with authentic Taal-aware grids and on-screen Swar synthesis.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/notations/create"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-sm sm:text-base shadow-lg shadow-amber-500/25 transition-all active:scale-95"
              >
                <Plus size={20} />
                <span>Create Notation</span>
              </Link>
            </div>
          </div>

          {/* Search bar & Stats */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="max-w-md w-full relative">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, raag, or taal..."
                className="w-full pl-11 pr-4 py-2.5 text-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs transition-all"
              />
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
              <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                {notations.length} {notations.length === 1 ? 'Notation' : 'Notations'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {!authUser && (
          <div className="mb-8 p-4 sm:p-5 rounded-2xl border border-amber-300 dark:border-amber-800/60 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-amber-950 dark:text-amber-200 text-sm shadow-sm">
            <div className="space-y-1">
              <span className="font-extrabold text-amber-800 dark:text-amber-300">
                ✨ Guest Composer Mode
              </span>
              <p className="text-xs text-amber-800/80 dark:text-amber-300/80">
                You can freely create and export PDF notations as a guest! Log in to save them to your personal cloud library forever.
              </p>
            </div>
            <Link
              href="/login?redirectTo=/notations"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold shadow-xs whitespace-nowrap active:scale-95 transition-all"
            >
              Sign In to Cloud
            </Link>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-56 rounded-3xl bg-slate-200/60 dark:bg-slate-800/60 animate-pulse border border-slate-200 dark:border-slate-800"
              />
            ))}
          </div>
        ) : notations.length === 0 ? (
          <div className="text-center py-20 px-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center mx-auto mb-5 shadow-lg shadow-amber-500/20">
              <Music size={36} />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-slate-50 font-serif">
              No Notations Found
            </h3>
            <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Start composing your first Bandish notation with our custom Indian Classical Swar keyboard, dynamic matra grids, and real-time sheet PDF generator.
            </p>
            <div className="mt-8">
              <Link
                href="/notations/create"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black text-sm shadow-md shadow-amber-500/25 hover:brightness-110 active:scale-95 transition-all"
              >
                <Plus size={18} />
                <span>Compose First Notation</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notations.map((item) => (
              <div
                key={item._id}
                className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1"
              >
                {/* Top gradient highlight */}
                <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 opacity-80 group-hover:opacity-100 transition-opacity" />

                {/* Card Body */}
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="inline-block px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800/60 shadow-2xs">
                        {item.taal?.name?.english || 'Teentaal'} • {item.taal?.matras || 16} Matras
                      </span>

                      <h3 className="text-xl font-black text-slate-950 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors font-serif pt-1">
                        {item.name}
                      </h3>

                      {item.raag && (
                        <p className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                          <Music size={12} className="text-amber-500" />
                          <span>{item.raag}</span>
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyShareLink(item.shareId)}
                      className="p-2.5 text-slate-400 hover:text-amber-600 rounded-xl hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors"
                      title="Share Public Link"
                    >
                      <Share2 size={17} />
                    </button>
                  </div>

                  {/* Metadata preview chips */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-2 text-[11px] text-slate-500">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800">
                      <Layers size={12} className="text-amber-500" />
                      <span>{item.sections?.length || 0} Sections</span>
                    </span>

                    {item.time && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800">
                        <Clock size={12} className="text-slate-400" />
                        <span>{item.time}</span>
                      </span>
                    )}

                    {item.vaadi && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800">
                        V: {item.vaadi} {item.samvaadi ? `• S: ${item.samvaadi}` : ''}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-6 py-4 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                    <Calendar size={13} />
                    <span>
                      {new Date(item.updatedAt || item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/notations/${item._id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white shadow-2xs hover:shadow-xs transition-all"
                      title="View & Print PDF"
                    >
                      <Printer size={14} className="text-amber-500" />
                      <span>PDF</span>
                    </Link>

                    <Link
                      href={`/notations/${item._id}/edit`}
                      className="p-2 text-slate-500 hover:text-amber-600 rounded-xl hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors"
                      title="Edit Notation"
                    >
                      <Edit size={16} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDelete(item._id, item.name)}
                      disabled={isDeleting}
                      className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Delete Notation"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
