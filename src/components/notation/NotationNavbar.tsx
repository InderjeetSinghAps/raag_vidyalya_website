'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, Music, ChevronRight } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface NotationNavbarProps {
  breadcrumbs?: BreadcrumbItem[];
  children?: React.ReactNode;
}

export const NotationNavbar: React.FC<NotationNavbarProps> = ({
  breadcrumbs,
  children,
}) => {
  return (
    <header className="no-print sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Left: Brand Logo, Home link & Breadcrumbs */}
        <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
          {/* Logo & Brand Name */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group shrink-0"
            title="Go to Home"
          >
            <div className="relative size-9 sm:size-10 overflow-hidden rounded-full border border-amber-500/40 shadow-xs group-hover:scale-105 transition-transform">
              <Image
                src="/logo.jpeg"
                alt="Raag Vidyalaya"
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Raag Vidyalaya
              </span>
              <span className="block text-[10px] font-semibold text-amber-600 dark:text-amber-400 -mt-0.5">
                Gurmat Sangeet
              </span>
            </div>
          </Link>

          {/* Divider */}
          <div className="hidden md:block h-6 w-px bg-slate-200 dark:bg-slate-800" />

          {/* Quick Nav: Home & Library Links */}
          <nav className="flex items-center gap-1">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Return to Home Page"
            >
              <Home size={14} className="text-amber-500" />
              <span>Home</span>
            </Link>

            <span className="text-slate-300 dark:text-slate-700">/</span>

            <Link
              href="/notations"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="My Notations Library"
            >
              <Music size={14} className="text-orange-500" />
              <span>Notations</span>
            </Link>

            {breadcrumbs && breadcrumbs.length > 0 && (
              <>
                {breadcrumbs.map((crumb, idx) => (
                  <React.Fragment key={idx}>
                    <ChevronRight size={13} className="text-slate-300 dark:text-slate-700 shrink-0" />
                    {crumb.href ? (
                      <Link
                        href={crumb.href}
                        className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white truncate max-w-[120px] sm:max-w-[200px]"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate max-w-[120px] sm:max-w-[200px]">
                        {crumb.label}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </>
            )}
          </nav>
        </div>

        {/* Right: Page-specific actions + ThemeToggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {children}

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          {/* Dark / Light Theme Toggle */}
          <div title="Switch Theme (Light / Dark)">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};
