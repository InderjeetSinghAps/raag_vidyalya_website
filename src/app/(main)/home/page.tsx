'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  BookOpen,
  Music,
  Star,
  StarHalf,
  Clock,
  Users,
  ShoppingBag,
  Play,
  Library,
  Headphones,
  GraduationCap,
  TrendingUp,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppDispatch } from '@/store/hooks';
import { playTrack } from '@/store/playerSlice';
import {
  courses,
  raags,
  gurbaniItems,
  contests,
  testimonials,
  storeProducts,
} from '@/data';

function StarRating({
  rating,
  size = 'sm',
}: {
  rating: number;
  size?: 'sm' | 'xs';
}) {
  const cls = size === 'xs' ? 'size-2.5' : 'size-3';
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <Star
          key={`f${i}`}
          className={`${cls} fill-yellow-400 text-yellow-400`}
        />
      ))}
      {half && (
        <StarHalf
          className={`${cls} fill-yellow-400 text-yellow-400`}
        />
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <Star
          key={`e${i}`}
          className={`${cls} text-muted-foreground`}
        />
      ))}
      <span className="ml-1 text-xs text-muted-foreground">
        {rating}
      </span>
    </div>
  );
}

const featureCards = [
  {
    icon: Library,
    label: '31 Raags',
    desc: 'Comprehensive collection of sacred raags',
  },
  {
    icon: Headphones,
    label: 'Authentic Lessons',
    desc: 'Learn from experienced Gurmat Sangeet practitioners',
  },
  {
    icon: GraduationCap,
    label: 'Expert Guidance',
    desc: 'Step-by-step guidance from certified teachers',
  },
  {
    icon: TrendingUp,
    label: 'Practice & Progress',
    desc: 'Track your learning journey with structured paths',
  },
];

const sectionHeading = 'py-12 px-4 sm:px-6 lg:px-8';

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div>
      <h2 className="text-balance text-2xl font-bold text-foreground">
        {title}
      </h2>
      <div className="mt-1.5 h-0.5 w-10 rounded-full bg-primary" />
      <p className="mt-1.5 text-sm text-muted-foreground">
        {subtitle}
      </p>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const stagger = {
    visible: { transition: { staggerChildren: 0.15 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring' as const,
        duration: 0.5,
        bounce: 0,
      },
    },
  };

  return (
    <div className="bg-background">
      <section className="relative min-h-[calc(100vh-72px)] overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0">
          <Image
            src="/hero.png"
            fill
            className="object-cover outline outline-1 -outline-offset-1 outline-white/10"
            alt=""
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, #06111d 0%, #06111d 30%, transparent 60%, transparent 100%)',
            }}
          />
        </div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative z-10 mx-auto flex max-w-[1400px] items-center py-16 lg:py-20"
        >
          <div className="max-w-[800px]">
            <motion.h1
              variants={fadeUp}
              className="text-balance text-4xl font-bold leading-[1.1] text-white sm:text-6xl lg:text-7xl"
            >
              Learn Gurmat Sangeet
            </motion.h1>
            <motion.h2
              variants={fadeUp}
              className="mt-6 text-balance text-4xl font-bold leading-[1.1] text-primary sm:text-6xl lg:text-7xl"
            >
              The Divine Way
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-8 max-w-[500px] text-pretty text-lg leading-relaxed"
              style={{ color: '#CBD5E1' }}
            >
              Discover the divine art of Sikh sacred music. Master
              ancient raags, authentic hymns, and timeless melodies
              passed down through generations.
            </motion.p>
            <motion.div
              variants={fadeUp}
              className="mt-8 flex items-center gap-4"
            >
              <Button
                onClick={() => router.push('/gurmat-sangeet')}
                className="h-11 border-0 px-6 text-sm font-medium text-[#081527] transition-all duration-200 active:scale-[0.96]"
                style={{
                  background: 'var(--color-primary, #D4A44A)',
                }}
              >
                Explore Raags
              </Button>
              <Button
                variant="outline"
                className="h-11 border border-white px-6 text-sm font-medium text-white transition-all duration-200 hover:shadow-[0_0_24px_-4px_rgba(255,255,255,0.3)] active:scale-[0.96]"
                onClick={() => router.push('/courses')}
              >
                View Courses
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featureCards.map((feature) => (
            <div
              key={feature.label}
              className="flex h-[140px] items-center gap-4 rounded-2xl bg-card p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(212,164,74,0.2),0_4px_12px_rgba(0,0,0,0.2)] active:scale-[0.98]"
            >
              <div
                className="flex size-12 shrink-0 items-center justify-center rounded-full"
                style={{
                  background: 'var(--color-secondary, #FFF5DD)',
                  border: '1px solid var(--color-primary, #E9C67A)',
                }}
              >
                <feature.icon className="size-5 text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-foreground">
                  {feature.label}
                </h3>
                <p
                  className="mt-0.5 text-sm leading-tight"
                  style={{ color: '#64748B' }}
                >
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={sectionHeading}>
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            title="Featured Courses"
            subtitle="Start your journey with our top courses"
          />
          <div className="mt-6 flex gap-4 overflow-x-auto pb-4">
            {courses.slice(0, 4).map((course) => (
              <Card
                key={course.id}
                className="w-64 shrink-0 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-[0.97]"
                onClick={() => router.push(`/courses/${course.id}`)}
              >
                <div className="flex h-36 items-center justify-center rounded-t-xl bg-muted outline outline-1 -outline-offset-1 outline-white/10">
                  <BookOpen className="size-8 text-muted-foreground" />
                </div>
                <CardContent className="space-y-2 pt-3">
                  <h3 className="font-semibold text-foreground">
                    {course.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {course.instructor}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="secondary"
                      className="text-[10px]"
                    >
                      {course.level}
                    </Badge>
                    <StarRating rating={course.rating} />
                  </div>
                  <p className="text-sm font-medium text-primary">
                    ₹{course.price}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className={sectionHeading}>
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            title="Popular Raags"
            subtitle="Explore the foundation of Gurmat Sangeet"
          />
          <div className="mt-6 flex gap-4 overflow-x-auto pb-4">
            {raags.slice(0, 6).map((raag) => (
              <div
                key={raag.id}
                className="w-56 shrink-0 rounded-xl bg-card p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-[0.97]"
              >
                <div className="flex h-28 items-center justify-center rounded-lg bg-muted outline outline-1 -outline-offset-1 outline-white/10">
                  <Music className="size-7 text-muted-foreground" />
                </div>
                <div className="mt-3 space-y-1">
                  <h3 className="font-semibold text-foreground">
                    {raag.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Thaat: {raag.thaat}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3" />
                    <span>{raag.time}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full border-primary text-primary transition-all duration-200 active:scale-[0.96]"
                  onClick={() =>
                    dispatch(
                      playTrack({
                        id: raag.id,
                        title: raag.name,
                        artist: raag.artist,
                        audioUrl: raag.audioUrl,
                        image: raag.image,
                        duration: raag.duration,
                      }),
                    )
                  }
                >
                  <Play className="size-3" />
                  Listen
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={sectionHeading}>
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            title="Daily Gurbani"
            subtitle="Sacred hymn for today"
          />
          <div className="mt-6">
            {gurbaniItems.length > 0 &&
              (() => {
                const item = gurbaniItems[0];
                return (
                  <div className="flex items-center gap-4 rounded-xl bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted outline outline-1 -outline-offset-1 outline-white/10">
                      <Music className="size-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground">
                        {item.title}
                      </h3>
                      <p className="truncate text-xs text-muted-foreground">
                        {item.gurmukhi}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground/70">
                        {item.transliteration}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0 border-primary text-primary transition-all duration-200 active:scale-[0.96]"
                      onClick={() =>
                        dispatch(
                          playTrack({
                            id: item.id,
                            title: item.title,
                            artist: item.artist,
                            audioUrl: item.audioUrl,
                            image: item.image,
                            duration: item.duration,
                          }),
                        )
                      }
                    >
                      <Play className="size-3" />
                      Listen Now
                    </Button>
                  </div>
                );
              })()}
          </div>
        </div>
      </section>

      {contests.length > 0 && (
        <section className={sectionHeading}>
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              title="Active Contests"
              subtitle="Participate and showcase your talent"
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {contests.map((contest) => (
                <Card
                  key={contest.id}
                  className="transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-[0.97]"
                >
                  <CardContent className="space-y-3 pt-4">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-foreground">
                        {contest.title}
                      </h3>
                      <Badge
                        variant="outline"
                        className={
                          contest.status === 'active'
                            ? 'border-green-500/30 bg-green-500/10 text-green-400'
                            : 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400'
                        }
                      >
                        {contest.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-primary">
                      {contest.prize}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {contest.deadline}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="size-3" />
                        {contest.participants} participants
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={sectionHeading}>
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            title="What Our Students Say"
            subtitle="Hear from our community"
          />
          <div className="mt-6 flex gap-4 overflow-x-auto pb-4">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="w-72 shrink-0 rounded-xl bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-[0.97]"
              >
                <p className="text-sm italic leading-relaxed text-foreground">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {t.name}
                  </span>
                  <StarRating rating={t.rating} size="xs" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={sectionHeading}>
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-balance text-2xl font-bold text-foreground">
                Our Store
              </h2>
              <div className="mt-1.5 h-0.5 w-10 rounded-full bg-primary" />
              <p className="mt-1.5 text-sm text-muted-foreground">
                Books, instruments, and more
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary transition-all duration-200 active:scale-[0.96]"
              onClick={() => router.push('/store')}
            >
              View All
            </Button>
          </div>
          <div className="mt-6 flex gap-4 overflow-x-auto pb-4">
            {storeProducts.slice(0, 3).map((product) => (
              <div
                key={product.id}
                className="w-48 shrink-0 rounded-xl bg-card p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-[0.97]"
              >
                <div className="flex h-28 items-center justify-center rounded-lg bg-muted outline outline-1 -outline-offset-1 outline-white/10">
                  <ShoppingBag className="size-6 text-muted-foreground" />
                </div>
                <div className="mt-3 space-y-1">
                  <h3 className="text-sm font-medium text-foreground">
                    {product.name}
                  </h3>
                  <p className="text-sm font-semibold text-primary">
                    ₹{product.price}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="xs"
                  className="mt-3 w-full border-primary text-primary transition-all duration-200 active:scale-[0.96]"
                  onClick={() => router.push('/store')}
                >
                  Shop Now
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-gradient-to-t from-[#0a1628] to-transparent py-8 text-center">
        <p className="text-sm text-muted-foreground">
          &copy; 2026 Raag Vidyalaya. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
