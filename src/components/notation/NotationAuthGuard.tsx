'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, Music, Sparkles, LogIn, UserPlus, ArrowLeft, Grid, ShieldCheck } from 'lucide-react';
import { NotationNavbar } from './NotationNavbar';

interface NotationAuthGuardProps {
  title?: string;
  subtitle?: string;
  redirectTo?: string;
}

export const NotationAuthGuard: React.FC<NotationAuthGuardProps> = ({
  title = 'Bandish Studio Sign In Required',
  subtitle = 'The Indian Classical Notation Studio, custom Taal grids, and personal Bandish library are reserved for registered musicians and students.',
  redirectTo = '/notations',
}) => {
  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-amber-500 selection:text-white">
      <NotationNavbar hideNotationsLink={true}>
        <Link
          href={`/login?redirectTo=${encodeURIComponent(redirectTo)}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-xs hover:brightness-110 active:scale-95 transition-all"
        >
          <LogIn size={14} />
          <span>Sign In</span>
        </Link>
      </NotationNavbar>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-amber-500/10 via-orange-500/10 to-rose-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-xl w-full bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden p-6 sm:p-10 text-center">
          {/* Top highlight bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

          {/* Badge & Lock Icon */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-xl shadow-amber-500/25">
              <Music size={36} />
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-full bg-slate-950 text-amber-400 border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-md">
              <Lock size={15} />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs font-extrabold mb-3">
            <ShieldCheck size={14} className="text-amber-600 dark:text-amber-400" />
            <span>Authenticated Member Access</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-slate-50 font-serif tracking-tight">
            {title}
          </h1>

          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
            {subtitle}
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={`/login?redirectTo=${encodeURIComponent(redirectTo)}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-sm shadow-lg shadow-amber-500/25 active:scale-95 transition-all"
            >
              <LogIn size={16} />
              <span>Sign In to Continue</span>
            </Link>

            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm border border-slate-200 dark:border-slate-700 active:scale-95 transition-all"
            >
              <UserPlus size={16} />
              <span>Create Free Account</span>
            </Link>
          </div>

          {/* Features bullet preview */}
          <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider block mb-0.5">
                Bhatkhande Swars
              </span>
              <p className="text-[11px] text-slate-500 leading-normal">
                Komal underline, Teevra Ma, and Saptak dots.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider block mb-0.5">
                Taal Matra Grids
              </span>
              <p className="text-[11px] text-slate-500 leading-normal">
                Authentic Vibhags, Bols, and Sam/Khali markings.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider block mb-0.5">
                Public Share Links
              </span>
              <p className="text-[11px] text-slate-500 leading-normal">
                Shareable links for anyone to view & print sheet music.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <ArrowLeft size={13} />
              <span>Return to Raag Vidyalaya Home</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
