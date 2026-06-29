'use client';

import { motion } from 'framer-motion';
import { Upload, Play, Trophy, Star, Music } from 'lucide-react';
import { UPLOAD_VIDEO_URL, YOUTUBE_CHANNEL_LINK } from '@/lib/constants';

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring' as const, duration: 0.5, bounce: 0 },
  },
};

const perks = [
  {
    icon: Play,
    title: 'YouTube Feature',
    desc: 'The winning video will be uploaded to our YouTube channel.',
  },
  {
    icon: Trophy,
    title: "Winner's History",
    desc: 'Featured in the Winner\u2019s History section of our app.',
  },
  {
    icon: Star,
    title: 'Get Recognized',
    desc: 'Don\u2019t miss the chance to show your talent and get recognized!',
  },
  {
    icon: Music,
    title: 'Start Creating',
    desc: 'Start creating, start winning!',
  },
];

export default function UploadVideoPage() {
  return (
    <div className="min-h-screen bg-background">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      >
        <motion.div variants={fadeUp} className="mb-6">
          <h1 className="text-xl font-semibold text-foreground">Upload Video</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Share your talent with the world</p>
        </motion.div>

        <div className="mt-8 space-y-10">
          <motion.div
            variants={fadeUp}
            className="rounded-xl border border-border bg-gradient-to-br from-primary/[0.04] to-background pt-0"
          >
            <div className="h-1.5 w-full rounded-t-xl bg-primary" />
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-foreground">
                Participate in Our Weekly Contest!
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
                Join our exciting weekly contest and get a chance to shine!
              </p>
              <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted-foreground">
                To participate, upload a video in your own voice. The video should be 2–5
                minutes long, recorded in landscape mode, and follow YouTube format
                guidelines.
              </p>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="grid gap-5 sm:grid-cols-2">
            {perks.map((perk) => (
              <div
                key={perk.title}
                className="group rounded-xl border border-border bg-card pt-0 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
              >
                <div className="h-1 w-full rounded-t-xl bg-gradient-to-r from-primary/60 to-primary/20" />
                <div className="p-5">
                  <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <perk.icon className="size-5" />
                  </div>
                  <h3 className="font-semibold text-foreground">{perk.title}</h3>
                  {perk.title === 'YouTube Feature' ? (
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      The winning video will be uploaded to our{' '}
                      <a
                        href={YOUTUBE_CHANNEL_LINK || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline hover:text-primary/80"
                      >
                        YouTube channel
                      </a>
                      .
                    </p>
                  ) : (
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {perk.desc}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="rounded-xl border border-border bg-card pt-0"
          >
            <div className="h-1.5 w-full rounded-t-xl bg-primary" />
            <div className="p-8">
              <p className="text-lg font-medium text-foreground">Upload Video</p>
              <a
                href={UPLOAD_VIDEO_URL || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/30 transition-all duration-200 hover:border-primary/60 hover:bg-primary/[0.03]"
                style={{ height: 320 }}
              >
                <Upload className="size-12 text-primary/50" />
                <p className="mt-3 text-base text-muted-foreground">Upload the video</p>
                <p className="mt-1 text-xs text-muted-foreground/60">
                  Supports mp4, mov &bull; 2&ndash;5 min &bull; Landscape
                </p>
              </a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
