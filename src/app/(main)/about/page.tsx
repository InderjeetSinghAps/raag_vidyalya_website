'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Music,
  Users,
  Globe,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { raags } from '@/data';

const stats = [
  { icon: Music, value: raags.length, label: 'Raags' },
  { icon: BookOpen, value: '37+', label: 'Courses' },
  { icon: Users, value: '2K+', label: 'Students' },
  { icon: Globe, value: '5+', label: 'Years' },
];

const appLinks = [
  {
    label: 'Play Store',
    url: 'https://play.google.com/store/apps/details?id=com.raag.raagvidalya',
    icon: '/google-play-badge.png',
  },
  {
    label: 'App Store',
    url: 'https://apps.apple.com/us/app/raag-vidyalya/id6773085164',
    icon: '/apple-store-badge.png',
  },
];

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
          className="mb-12"
        >
          <h1 className="font-display text-balance text-4xl font-bold text-foreground sm:text-5xl">
            About Raag Vidyalaya
          </h1>
          <div className="mt-3 flex items-center gap-2">
            <span className="h-0.5 w-12 rounded-full bg-gradient-to-r from-primary to-transparent" />
            <span className="size-1.5 rounded-full bg-primary" />
            <span className="h-0.5 w-8 rounded-full bg-gradient-to-l from-primary/50 to-transparent" />
          </div>
        </motion.div>

        {/* Hero */}
        <section className="grid gap-10 lg:grid-cols-2">
          <div className="relative">
            <div className="pointer-events-none absolute -top-20 -left-20 h-[400px] w-[400px] rounded-full bg-[#D4A44A]/[0.04] blur-[120px]" aria-hidden="true" />

            <h2 className="font-display text-balance text-3xl font-bold text-foreground">
              Preserving the Divine Art of Gurmat Sangeet
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Raag Vidyalaya is dedicated to preserving and sharing
              the sacred tradition of Gurmat Sangeet — the classical
              music of the Sikh faith. Our platform brings together
              authentic raags, traditional hymns, and expert guidance
              to make this divine art accessible to learners
              worldwide.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Whether you are a beginner taking your first steps or an
              advanced practitioner deepening your understanding, Raag
              Vidyalaya offers structured courses, detailed raag
              theory, and a rich library of gurbani kirtan to support
              your journey.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                onClick={() => router.push('/courses')}
                className="h-11 border-0 bg-gradient-to-r from-[#D4A44A] to-[#C49A3A] px-6 text-sm font-medium text-white shadow-[0_4px_20px_rgba(212,164,74,0.2)] transition-all duration-200 hover:shadow-[0_6px_24px_rgba(212,164,74,0.35)] hover:brightness-110 active:scale-[0.96]"
              >
                Browse Courses
              </Button>
              <Button
                variant="outline"
                className="h-11 border-primary px-6 text-sm font-medium text-primary transition-all duration-200 active:scale-[0.96]"
                onClick={() => router.push('/gurmat-sangeet')}
              >
                Explore Raags
              </Button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.2, 0, 0, 1] }}
            className="group relative"
          >
            <div className="rounded-2xl border border-border/50 bg-card/80 p-2 shadow-lg backdrop-blur-2xl transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-[0_0_24px_-4px_rgba(212,164,74,0.15)] dark:border-white/[0.06] dark:bg-white/[0.04]">
              <div className="aspect-video overflow-hidden rounded-xl">
                <iframe
                  src="https://www.youtube.com/embed/1dUR7B2-CwY"
                  title="Raag Vidyalaya"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="size-full"
                />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Stats */}
        <section className="mt-16">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * i, ease: [0.2, 0, 0, 1] }}
                className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/80 p-6 text-center backdrop-blur-xl transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_20px_-4px_rgba(212,164,74,0.15)] dark:border-white/[0.06] dark:bg-white/[0.04]"
              >
                <stat.icon className="absolute -right-4 -top-4 size-16 text-foreground/[0.03]" />

                <div className="relative">
                  <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-primary/10">
                    <stat.icon className="size-5 text-primary" />
                  </div>
                  <p className="mt-3 bg-gradient-to-r from-[#D4A44A] to-[#F5D485] bg-clip-text text-2xl font-bold text-transparent">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-muted-foreground/80">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* App CTA */}
        <section className="mt-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.2, 0, 0, 1] }}
            className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.08] via-primary/[0.03] to-transparent p-8 text-center backdrop-blur-xl sm:p-12"
          >
            <div className="pointer-events-none absolute -top-20 -right-20 h-[300px] w-[300px] rounded-full bg-[#D4A44A]/[0.06] blur-[100px]" aria-hidden="true" />

            <div className="relative">
              <h2 className="font-display text-balance text-2xl font-bold text-foreground sm:text-3xl">
                Download the App
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Access Raag Vidyalaya on the go. Available on both platforms.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                {appLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center leading-none"
                  >
                    <img src={link.icon} alt={link.label} className="block h-10 w-auto" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
