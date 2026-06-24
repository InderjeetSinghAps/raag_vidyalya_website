'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  BookOpen,
  Music,
  ChevronDown,
  Star,
  StarHalf,
  Clock,
  Users,
  ShoppingBag,
  MessageCircle,
  Play,
  Library,
  Headphones,
  GraduationCap,
  TrendingUp,
  Music2,
  Lock,
  Gift,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { playTrack } from '@/store/playerSlice';
import {
  getGoogleDriveAudioUrl,
  getYouTubeVideoId,
} from '@/lib/video';
import { LIVE_AMRITSAR_KIRTAN_URL } from '@/lib/constants';
import {
  useGetCoursesQuery,
  useGetProductsQuery,
  useGetGurbaniCollectionsQuery,
  useGetRaagsQuery,
  useGetCollaboratorsQuery,
  useGetPreviousResultsQuery,
  useGetRaagAccessQuery,
} from '@/store/api';
import type {
  RaagApiItem,
  Collaborator,
  StoreProduct,
} from '@/types';
import { testimonials } from '@/data';
import { toast } from 'sonner';

const levelColors: Record<string, string> = {
  Beginner: 'text-emerald-400 border-emerald-500/20',
  Intermediate: 'text-amber-400 border-amber-500/20',
  Advanced: 'text-rose-400 border-rose-500/20',
};

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

function PreviousResultSection() {
  const router = useRouter();
  const { data, isLoading } = useGetPreviousResultsQuery();
  const result = data?.previousResults?.[0];
  if (!result || isLoading) return null;

  const videoId = getYouTubeVideoId(result.videoUrl);

  return (
    <section className={sectionHeading}>
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <SectionHeader
            title="Contest Results"
            subtitle="Watch the latest contest performance"
          />
          <Button
            variant="ghost"
            size="sm"
            className="text-primary transition-all duration-200 active:scale-[0.96]"
            onClick={() => router.push('/contests/previous-results')}
          >
            View All
          </Button>
        </div>
        <div className="mt-6 flex pb-6 pt-2">
          <div
            onClick={() => {
              if (videoId) {
                window.open(result.videoUrl, '_blank');
              }
            }}
            className="group w-full max-w-lg cursor-pointer overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-[0.97]"
          >
            <div className="relative flex h-48 items-center justify-center overflow-hidden rounded-t-xl bg-gradient-to-br from-primary/20 to-primary/5">
              {videoId ? (
                <img
                  src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                  alt={result.title}
                  className="absolute inset-0 size-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                  }}
                />
              ) : null}
              <div className="relative flex size-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                <Play className="size-8 text-white/80" />
              </div>
            </div>
            <div className="space-y-2 p-4">
              <h3 className="font-semibold text-foreground">{result.title}</h3>
              {result.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {result.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CollaboratorsSection() {
  const { data: collaborators = [] } = useGetCollaboratorsQuery();

  if (collaborators.length === 0) return null;

  return (
    <section className={sectionHeading}>
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          title="Our Collaborators"
          subtitle="Meet the people behind Raag Vidyalya"
        />
        <div className="mt-6 flex gap-4 overflow-x-auto pb-6 pt-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {collaborators.map((c: Collaborator) => (
            <a
              key={c._id}
              href={`/collaborator/${c._id}`}
              className="group w-72 shrink-0 overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-[0.97] flex flex-col"
            >
              <div className="relative h-46 bg-gradient-to-br from-primary/20 to-primary/5">
                {c.coverProfile && (
                  <img
                    src={c.coverProfile}
                    alt=""
                    className="size-full object-cover"
                  />
                )}
                <div className="absolute -bottom-8 left-4 size-16 overflow-hidden rounded-full border-2 border-card bg-muted">
                  {c.profile ? (
                    <img
                      src={c.profile}
                      alt={c.name}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-primary/10">
                      <Users className="size-6 text-primary/60" />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1 px-3 pb-4 pt-10">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {c.name}
                </h3>
                {c.profession && (
                  <span className="mt-2 inline-block rounded-full bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary">
                    {c.profession}
                  </span>
                )}
                {c.phoneNumber && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      window.open(
                        `https://api.whatsapp.com/send/?phone=${c.phoneNumber}&text=${encodeURIComponent(`Hello ${c.name}, I am contacting you from RAAG VIDYALYA application. Want to more information about your programs.`)}`,
                        '_blank',
                      );
                    }}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-primary/30 px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/10 active:scale-[0.97]"
                  >
                    <MessageCircle className="size-3.5" />
                    Send Message
                  </button>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function StoreCard({ product }: { product: StoreProduct }) {
  const router = useRouter();

  const handleSendMessage = (
    e: React.MouseEvent,
    prod: StoreProduct,
  ) => {
    e.stopPropagation();
    if (!prod.sellerPhone) {
      toast.error('Seller contact not available');
      return;
    }
    const clean = prod.sellerPhone.replace(/\D/g, '');
    const message = `Hello! I'm interested in the "${prod.name}".\n\u{1F4CC} Description: ${prod.description}\n\u{1F4B0} Price: \u20B9${prod.price}${prod.originalPrice ? ` (Original: \u20B9${prod.originalPrice})` : ''}\n\u{1F3AF} Category: ${prod.category}\nCould you please share more details or help me with the purchase?`;
    window.open(
      `https://api.whatsapp.com/send/?phone=${clean}&text=${encodeURIComponent(message)}`,
      '_blank',
    );
  };

  return (
    <div
      key={product.id}
      onClick={() => router.push(`/store/${product.id}`)}
      className="flex flex-col w-64 shrink-0 group cursor-pointer rounded-xl border border-border bg-background transition-all hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.08)] active:scale-[0.97]"
    >
      <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-t-xl bg-background">
        {product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="absolute inset-0 size-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <ShoppingBag className="size-10 text-muted-foreground/80 transition-colors group-hover:text-cyan-400/50" />
        )}
      </div>
      <div className="flex flex-1 flex-col space-y-2 p-3">
        <p className="truncate text-sm font-medium text-foreground">
          {product.name}
        </p>
        <div className="flex items-baseline gap-2">
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground/80 line-through">
              ₹{product.originalPrice}
            </span>
          )}
          <span className="text-sm font-bold text-cyan-400">
            ₹{product.price}
          </span>
        </div>
        {product.sellerName && (
          <p className="text-[11px] text-muted-foreground/70 truncate">
            {product.sellerAvatar && (
              <img
                src={product.sellerAvatar}
                alt=""
                width={14}
                height={14}
                referrerPolicy="no-referrer"
                className="mr-1 inline-block rounded-full object-cover align-text-bottom"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <span className="text-primary">
              {product.sellerName}{' '}
            </span>
          </p>
        )}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] text-cyan-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <Button
          variant="outline"
          size="sm"
          className="mt-auto w-full border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 active:scale-[0.96]"
          onClick={(e) => handleSendMessage(e, product)}
        >
          <MessageCircle className="size-3" />
          Send Message
        </Button>
      </div>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: coursesData } = useGetCoursesQuery({
    page: 1,
    limit: 4,
  });
  const courses = coursesData?.courses ?? [];
  const { data: productsData } = useGetProductsQuery({
    page: 1,
    limit: 4,
  });
  const storeProducts = productsData?.products ?? [];
  const [courseThumbStates, setCourseThumbStates] = useState<
    Record<string, 'maxresdefault' | 'hqdefault' | 'failed'>
  >({});
  const { data: gurbaniCollections } =
    useGetGurbaniCollectionsQuery();
  const [openCollectionIds, setOpenCollectionIds] = useState<
    Set<string>
  >(new Set());
  const toggleCollection = (id: string) => {
    setOpenCollectionIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const { data: raagsData } = useGetRaagsQuery();
  const apiRaags = raagsData?.raags ?? [];
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const { data: accessData } = useGetRaagAccessQuery(undefined, { skip: !isAuthenticated });
  const unlockedSet = new Set(accessData?.raagAccess?.map((r) => r.raagNumber) ?? []);

  const { data: collaborators = [] } = useGetCollaboratorsQuery();

  const { theme } = useTheme();
  const isLightTheme = theme === 'light';
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
            src={isLightTheme ? '/hero-light.png' : '/hero.png'}
            fill
            className={`object-cover outline outline-1 -outline-offset-1 ${isLightTheme ? 'outline-black/5' : 'outline-white/10'}`}
            alt=""
            priority
          />
          <div
            className="absolute inset-0 md:hidden"
            style={{
              background: isLightTheme
                ? 'linear-gradient(180deg, #ffffff 0%, #ffffff 60%, transparent 80%, transparent 100%)'
                : 'linear-gradient(180deg, #06111d 0%, #06111d 60%, transparent 80%, transparent 100%)',
            }}
          />
          <div
            className="absolute inset-0 hidden md:block"
            style={{
              background: isLightTheme
                ? 'linear-gradient(90deg, #ffffff 0%, #ffffff 30%, transparent 60%, transparent 100%)'
                : 'linear-gradient(90deg, #06111d 0%, #06111d 30%, transparent 60%, transparent 100%)',
            }}
          />
        </div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative z-10 mx-auto flex max-w-[1400px] items-center py-10 md:py-16 lg:py-20"
        >
          <div className="max-w-[800px]">
            <motion.h1
              variants={fadeUp}
              className={`text-balance text-4xl font-bold leading-[1.1] sm:text-6xl lg:text-7xl ${isLightTheme ? 'text-gray-900' : 'text-white'}`}
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
              style={{ color: isLightTheme ? '#4B5563' : '#CBD5E1' }}
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
                className={`h-11 border px-6 text-sm font-medium backdrop-blur-sm transition-all duration-200 active:scale-[0.96] ${
                  isLightTheme
                    ? 'border-gray-300 bg-gray-100/80 text-gray-700 hover:border-gray-400 hover:bg-gray-200/80 hover:text-gray-900'
                    : 'border-white/40 bg-white/[0.06] text-white/90 hover:border-white/60 hover:bg-white/[0.1] hover:text-white'
                }`}
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
              className={`flex h-[140px] items-center gap-4 rounded-2xl bg-card p-6 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] ${
                isLightTheme
                  ? 'shadow-[0_0_0_1px_rgba(0,0,0,0.06)] hover:shadow-[0_0_0_1px_rgba(212,164,74,0.3),0_4px_12px_rgba(0,0,0,0.08)]'
                  : 'shadow-[0_0_0_1px_rgba(255,255,255,0.06)] hover:shadow-[0_0_0_1px_rgba(212,164,74,0.2),0_4px_12px_rgba(0,0,0,0.2)]'
              }`}
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

{LIVE_AMRITSAR_KIRTAN_URL && (
        <section className={sectionHeading}>
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              title="Featured Live Kirtan"
              subtitle="Live from Darbar Sahib, Golden Temple, Amritsar"
            />
            <div className="mt-6 flex gap-4 overflow-x-auto pb-6 pt-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <Card
                className="w-64 shrink-0 cursor-pointer overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-[0.97]"
                onClick={() => router.push('/live')}
              >
                <div className="relative flex h-40 shrink-0 items-center justify-center overflow-hidden rounded-t-xl bg-gradient-to-br from-amber-900/40 to-amber-950/60">
                  <div className="flex size-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                    <Play className="size-8 text-white/80" />
                  </div>
                  <Badge className="absolute left-2 top-2 flex items-center gap-1 border-0 bg-red-500/90 px-2 py-1 text-[10px] font-semibold text-white uppercase tracking-wider">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                    </span>
                    LIVE
                  </Badge>
                </div>
                <CardContent className="space-y-2 p-4">
                  <h3 className="font-semibold text-foreground">Darbar Sahib</h3>
                  <p className="text-xs text-muted-foreground">Golden Temple, Amritsar</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                    </span>
                    Streaming now
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-auto w-full border-primary text-primary transition-all duration-200 active:scale-[0.96]"
                  >
                    Listen Now
                  </Button>
                </CardContent>
              </Card>
              <Card
                className="w-64 shrink-0 cursor-pointer overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-[0.97]"
                onClick={() => router.push('/riyaz/tanpura')}
              >
                <div className="relative flex h-40 shrink-0 items-center justify-center overflow-hidden rounded-t-xl bg-gradient-to-br from-amber-800/50 to-[#0B1020]">
                  <div className="flex size-16 items-center justify-center rounded-full bg-[rgba(212,160,23,.15)] backdrop-blur-sm">
                    <Music2 className="size-8 text-amber-400/80" />
                  </div>
                </div>
                <CardContent className="space-y-2 p-4">
                  <h3 className="font-semibold text-foreground">Daily Riyaz</h3>
                  <p className="text-xs text-muted-foreground">Tanpura practice & exercises</p>
                  <div className="flex items-center gap-1 text-xs text-amber-400/80">
                    Build your daily practice routine
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-auto w-full border-amber-500/50 text-amber-400 transition-all duration-200 hover:bg-amber-500/10 active:scale-[0.96]"
                  >
                    Start Practice
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
)}

      <PreviousResultSection />

      <section className={sectionHeading}>
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            title="Featured Courses"
            subtitle="Start your journey with our top courses"
          />
          <div className="mt-6 flex gap-4 overflow-x-auto pb-6 pt-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {courses.slice(0, 4).map((course) => {
              const state =
                courseThumbStates[course.id] || 'maxresdefault';
              const thumbSrc =
                course.thumbnail ??
                (state !== 'failed' &&
                getYouTubeVideoId(course.videos?.[0]?.videoUrl)
                  ? `https://img.youtube.com/vi/${getYouTubeVideoId(course.videos[0].videoUrl)}/${state}.jpg`
                  : null);

              return (
                <Card
                  key={course.id}
                  className="w-64 shrink-0 cursor-pointer overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-[0.97]"
                  onClick={() => router.push(`/courses/${course.id}`)}
                >
                  <div className="relative flex h-40 shrink-0 items-center justify-center overflow-hidden rounded-t-xl bg-background">
                    {thumbSrc ? (
                      <Image
                        src={thumbSrc}
                        alt={course.title}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover"
                        onError={() => {
                          setCourseThumbStates((prev) => {
                            const current =
                              prev[course.id] || 'maxresdefault';
                            if (current === 'maxresdefault') {
                              return {
                                ...prev,
                                [course.id]: 'hqdefault',
                              };
                            }
                            return {
                              ...prev,
                              [course.id]: 'failed',
                            };
                          });
                        }}
                      />
                    ) : null}
                    <Badge className="absolute left-2 top-2 border border-amber-500/30 bg-background/60 px-2 py-0.5 text-[10px] font-medium text-amber-400 uppercase tracking-wider backdrop-blur-sm">
                      {course.isFree ? 'Free' : 'Paid'}
                    </Badge>
                    <Badge
                      className={`absolute right-2 top-2 border bg-background/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider backdrop-blur-sm ${levelColors[course.level] || ''}`}
                    >
                      {course.level}
                    </Badge>
                    <BookOpen className="size-12 text-cyan-400/30" />
                  </div>
                  <CardContent className="space-y-2 p-4">
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
                      {course.isFree ? 'Free' : `₹${course.price}`}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className={sectionHeading}>
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            title="31 Raags"
            subtitle="Explore the foundation of Gurmat Sangeet"
          />
          <Carousel
            opts={{ align: 'start', loop: false, watchDrag: true }}
            className="mt-6 w-full"
          >
            <CarouselContent className="-ml-4">
              {apiRaags.slice(0, 8).map((raag: RaagApiItem) => {
                const isFree = raag.id <= 2
                const isUnlocked = unlockedSet.has(raag.id)
                return (
                <CarouselItem
                  key={raag._id}
                  onClick={() =>
                    router.push(`/gurmat-sangeet/${raag._id}`)
                  }
                  className="basis-[65%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 pl-4"
                >
                  <div className="flex h-full flex-col rounded-xl bg-card p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-[0.97]">
                    <div className="relative flex h-28 shrink-0 items-center justify-center rounded-lg">
                      {!isFree && !isUnlocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px] rounded-lg z-10">
                          <Lock className="size-7 text-amber-400/60" />
                        </div>
                      )}
                      <img
                        src="/logo2.svg"
                        alt="logo"
                        className="size-40 text-primary/30"
                      />
                    </div>
                    <div className="mt-3 flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">
                          {raag.name}
                        </h3>
                        {isFree && (
                          <Badge className="border border-cyan-500/20 bg-cyan-500/10 text-[10px] font-medium text-cyan-400">Free</Badge>
                        )}
                        {isUnlocked && (
                          <Badge className="border border-green-500/20 bg-green-500/10 text-[10px] font-medium text-green-400">Unlocked</Badge>
                        )}
                        {!isFree && !isUnlocked && (
                          <Badge className="border border-amber-500/20 bg-amber-500/10 text-[10px] font-medium text-amber-400">
                            <Gift className="mr-1 size-3" />
                            Refer
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Thaat: {raag.thaat}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="size-3" />
                        <span>{raag.time}</span>
                      </div>
                      <p className="font-mono text-xs text-primary/80">
                        {raag.aroh}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-auto w-full border-primary text-primary transition-all duration-200 active:scale-[0.96]"
                    >
                      {!isFree && !isUnlocked ? <><Lock className="mr-1.5 size-3" /> Premium</> : 'View Details'}
                    </Button>
                  </div>
                </CarouselItem>
                )
              })}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:inline-flex rounded-full border-border text-muted-foreground hover:text-foreground" />
            <CarouselNext className="hidden sm:inline-flex rounded-full border-border text-muted-foreground hover:text-foreground" />
          </Carousel>
        </div>
      </section>

      <section className={sectionHeading}>
        <div className="mx-auto max-w-7xl">
          <SectionHeader title="Daily Gurbani" subtitle="" />
          <div className="mt-6 space-y-4">
            {(gurbaniCollections ?? []).map((collection) => (
              <div
                key={collection._id}
                className="overflow-hidden rounded-xl border border-border bg-card"
              >
                <button
                  onClick={() => toggleCollection(collection._id)}
                  className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-muted/30"
                >
                  <ChevronDown
                    className={`size-4 shrink-0 text-muted-foreground/60 transition-transform duration-200 ${
                      openCollectionIds.has(collection._id)
                        ? 'rotate-0'
                        : '-rotate-90'
                    }`}
                  />
                  <BookOpen className="size-5 text-cyan-400 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h2 className="text-sm font-semibold text-foreground">
                      {collection.title}
                    </h2>
                    {collection.titleGurmukhi && (
                      <p className="text-xs text-muted-foreground/80">
                        {collection.titleGurmukhi}
                      </p>
                    )}
                  </div>
                  <p className="shrink-0 text-xs text-muted-foreground/60">
                    {collection.baanis.length} baanis
                  </p>
                </button>
                {openCollectionIds.has(collection._id) && (
                  <div className="divide-y divide-border border-t border-border">
                    {(collection.baanis ?? []).map((baani) => (
                      <div
                        key={baani._id}
                        className="flex cursor-pointer items-center gap-4 px-5 py-3 pl-12 transition-colors hover:bg-muted/30"
                        onClick={() =>
                          router.push(`/gurbani/${baani._id}`)
                        }
                      >
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-medium text-foreground">
                            {baani.title}
                          </h3>
                          {baani.gurmukhi && (
                            <p className="truncate text-xs text-muted-foreground/80">
                              {baani.gurmukhi}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-8 shrink-0 rounded-full border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 active:scale-[0.96]"
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(
                              playTrack({
                                id: baani._id,
                                title: baani.title,
                                artist: '',
                                audioUrl:
                                  getGoogleDriveAudioUrl(
                                    baani.audioUrl,
                                  ) || baani.audioUrl,
                                image: '',
                                duration: '',
                              }),
                            );
                          }}
                        >
                          <Play className="size-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          {(!gurbaniCollections ||
            gurbaniCollections.length === 0) && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Music className="mb-3 size-8 text-muted-foreground/60" />
              <p className="text-sm text-muted-foreground">
                No hymns available
              </p>
            </div>
          )}
        </div>
      </section>

      <CollaboratorsSection />

      <section className={sectionHeading}>
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <SectionHeader
              title="Our Store"
              subtitle="Books, instruments, and more"
            />
            <Button
              variant="ghost"
              size="sm"
              className="text-primary transition-all duration-200 active:scale-[0.96]"
              onClick={() => router.push('/store')}
            >
              View All
            </Button>
          </div>
          <div className="mt-6 flex gap-4 overflow-x-auto pb-6 pt-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {storeProducts.slice(0, 5).map((product) => (
              <StoreCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-gradient-to-t from-background to-transparent py-8 text-center">
        <p className="text-sm text-muted-foreground">
          &copy; 2026 Raag Vidyalaya. All rights reserved.
        </p>
        <div className="relative mt-6 flex flex-wrap items-center justify-center gap-4">
          {appLinks.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center leading-none"
            >
              <img
                src={link.icon}
                alt={link.label}
                className="block h-10 w-auto"
              />
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
