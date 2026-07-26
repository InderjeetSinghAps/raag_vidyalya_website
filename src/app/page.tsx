'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Music,
  Download,
  Smartphone,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

import { ContactModal } from '@/components/ContactModal';

const APP_LINKS = [
  {
    name: 'Google Play Store',
    platform: 'Android',
    url: 'https://play.google.com/store/apps/details?id=com.raag.raagvidalya',
    badge: '/google-play-badge.png',
  },
  {
    name: 'Apple App Store',
    platform: 'iOS',
    url: 'https://apps.apple.com/us/app/raag-vidyalya/id6773085164',
    badge: '/apple-store-badge.png',
  },
];

const FEATURES = [
  '31 Sacred Gurmat Raags with Detailed Swar Analysis',
  'Interactive Tanpura & Riyaz Practice Tools',
  'Authentic Audio & Video Lessons by Master Teachers',
  'Gurbani Baani Collection with Audio & PDF Lyrics',
];

export default function UnderDevelopmentPage() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-between overflow-hidden bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-[10%] -top-[10%] size-[500px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -right-[10%] top-[40%] size-[500px] rounded-full bg-amber-500/10 blur-[140px]" />
        <div className="absolute left-[30%] -bottom-[10%] size-[400px] rounded-full bg-primary/5 blur-[100px]" />
        <Image
          src="/logo3.svg"
          fill
          className="object-contain opacity-[0.025] pointer-events-none select-none"
          alt=""
          priority
        />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-10 flex w-full max-w-7xl items-center justify-between px-6 py-6 sm:px-10">
        <div className="flex items-center gap-3">
          <div className="relative size-11 overflow-hidden rounded-full border border-primary/30 shadow-md">
            <Image
              src="/logo.jpeg"
              alt="Raag Vidyalaya"
              fill
              sizes="44px"
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
              Raag Vidyalaya
            </h1>
            <p className="text-[11px] font-medium text-primary">
              Gurmat Sangeet Academy
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setContactOpen(true)}
            className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-primary-foreground active:scale-[0.96]"
          >
            Contact Us
          </button>
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5 animate-pulse text-primary" />
            <span>Mobile App Available</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Body */}
      <div className="relative z-10 my-auto flex w-full max-w-5xl flex-col items-center px-6 py-10 text-center sm:px-10">
        {/* Under Development Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 rounded-full border border-primary/30 bg-card/80 px-4 py-2 text-xs font-medium text-primary shadow-sm backdrop-blur-md sm:text-sm"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          <span className="font-semibold uppercase tracking-widest text-[11px] sm:text-xs">
            Website Under Development
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 text-balance text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
        >
          Something Sacred is <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-primary via-amber-400 to-yellow-500 bg-clip-text text-transparent">
            Coming Soon to the Web
          </span>
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 max-w-2xl text-balance text-sm leading-relaxed text-muted-foreground sm:text-base lg:text-lg"
        >
          We are currently crafting an immersive web experience for learning Gurmat Sangeet, 31 Sacred Raags, Gurbani, and Riyaz tools. In the meantime, download our complete mobile app experience available now on Android & iOS!
        </motion.p>

        {/* App Download Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md"
        >
          {APP_LINKS.map((app) => (
            <a
              key={app.name}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex w-full sm:w-auto items-center justify-center gap-3.5 rounded-2xl border border-primary/30 bg-card px-6 py-3.5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-primary/20 active:scale-[0.98]"
            >
              <div className="relative h-9 w-28 shrink-0">
                <Image
                  src={app.badge}
                  alt={app.name}
                  fill
                  sizes="112px"
                  className="object-contain"
                />
              </div>
            </a>
          ))}
        </motion.div>

        {/* Feature Highlights Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-3xl text-left"
        >
          {FEATURES.map((feat, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 rounded-xl border border-border/80 bg-card/60 p-3.5 backdrop-blur-sm transition-colors hover:border-primary/40"
            >
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CheckCircle2 className="size-4" />
              </div>
              <span className="text-xs font-medium text-foreground sm:text-sm">
                {feat}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Contact Modal */}
      <ContactModal open={contactOpen} onOpenChange={setContactOpen} />

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Raag Vidyalaya. All rights reserved.</p>
      </footer>
    </main>
  );
}
