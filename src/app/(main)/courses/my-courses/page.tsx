'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Search,
  BookOpen,
  User,
  Star,
  Play,
  GraduationCap,
  Loader2,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from '@/components/ui/input';
import { useGetMyEnrollmentsQuery } from '@/store/api';
import { getYouTubeVideoId } from '@/lib/video';

const levelColors: Record<string, string> = {
  Beginner: 'text-emerald-400 border-emerald-500/20',
  Intermediate: 'text-amber-400 border-amber-500/20',
  Advanced: 'text-rose-400 border-rose-500/20',
};

// const levels = ['beginner', 'intermediate', 'advanced'];
// const typeFilters = ['free', 'paid'];

// const filterLabels: Record<string, string> = {
//   all: 'All',
//   beginner: 'Beginner',
//   intermediate: 'Intermediate',
//   advanced: 'Advanced',
//   free: 'Free',
//   paid: 'Paid',
// };

export default function MyCoursesPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  // const [level, setLevel] = useState('all');
  // const [type, setType] = useState('all');

  const { data, isLoading } = useGetMyEnrollmentsQuery({
    page: 1,
    limit: 50,
  });
  const enrollments = data?.enrollments ?? [];
  const enrolledCourses = enrollments.map((e) => e.course);

  const filtered = enrolledCourses.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.toLowerCase().includes(search.toLowerCase());
    // const matchLevel =
    //   level === 'all' || c.level.toLowerCase() === level;
    // const matchType =
    //   type === 'all' || (type === 'free' ? c.isFree : !c.isFree);
    // return matchSearch && matchLevel && matchType;
    return matchSearch;
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-8 animate-spin text-muted-foreground/60" />
        </div>
      </div>
    );
  }

  if (enrolledCourses.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-balance text-3xl font-bold text-foreground">
          My Enrollments
        </h1>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <BookOpen className="mb-4 size-16 text-muted-foreground/80" />
          <p className="text-lg text-muted-foreground">
            You haven&apos;t enrolled in any courses yet
          </p>
          <Button
            variant="default"
            className="mt-6 bg-cyan-500 text-foreground hover:bg-cyan-400 active:scale-[0.96]"
            onClick={() => router.push('/courses')}
          >
            Browse Courses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="px-5 mt-[-25px]">
        <Button
          variant="ghost"
          size="lg"
          className="gap-1.5"
          onClick={() => router.back()}
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
      </div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-balance text-2xl font-bold text-foreground">
              My Enrollments
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Continue your learning journey
            </p>
          </div>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search your courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-border bg-background pl-10 text-muted-foreground placeholder:text-muted-foreground/80"
          />
        </div>
      </div>
      {/* 
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => { setLevel("all"); setType("all") }}
          className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-200 hover:border-border hover:text-foreground ${
            level === "all" && type === "all"
              ? "border-primary bg-primary text-primary-foreground shadow-sm"
              : "border-border/50 text-muted-foreground"
          }`}
        >
          All
        </button>

        <Tabs value={level} onValueChange={(v) => { setLevel(v); setType("all") }}>
          <TabsList className="flex gap-3 bg-transparent p-0">
            {levels.map((l) => (
              <TabsTrigger
                key={l}
                value={l}
                className="rounded-full border border-border/50 px-4 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-200 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm hover:border-border hover:text-foreground"
              >
                {filterLabels[l] || l}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Tabs value={type} onValueChange={(v) => { setType(v); setLevel("all") }}>
          <TabsList className="flex gap-3 bg-transparent p-0">
            {typeFilters.map((t) => (
              <TabsTrigger
                key={t}
                value={t}
                className="rounded-full border border-border/50 px-4 py-1.5 text-xs font-medium text-muted-foreground capitalize transition-all duration-200 data-[state=active]:border-cyan-500/50 data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400 data-[state=active]:shadow-sm hover:border-border hover:text-foreground"
              >
                {filterLabels[t] || t}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div> */}

      <div className="mt-8 mb-4">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => {
            const enrollment = enrollments.find(
              (e) => e.course.id === course.id,
            );
            const thumbSrc =
              course.thumbnail ??
              (getYouTubeVideoId(course.videos?.[0]?.videoUrl)
                ? `https://img.youtube.com/vi/${getYouTubeVideoId(course.videos[0].videoUrl)}/maxresdefault.jpg`
                : null);

            return (
              <div
                key={course.id}
                onClick={() => router.push(`/courses/${course.id}`)}
                className="group flex cursor-pointer flex-col rounded-xl border border-border bg-background transition-all hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.08)]"
              >
                <div className="relative flex h-40 shrink-0 items-center justify-center overflow-hidden rounded-t-xl bg-background">
                  {thumbSrc ? (
                    <img
                      src={thumbSrc}
                      alt={course.title}
                      referrerPolicy="no-referrer"
                      className="size-full object-cover"
                      onError={(e) => {
                        const img = e.currentTarget;
                        if (img.src.includes('maxresdefault')) {
                          img.src = img.src.replace(
                            'maxresdefault',
                            'hqdefault',
                          );
                        } else {
                          img.style.display = 'none';
                          img.nextElementSibling?.classList.remove(
                            'hidden',
                          );
                        }
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
                  <BookOpen className="hidden size-12 text-cyan-400/30" />
                </div>
                <div className="flex flex-1 flex-col space-y-2 p-4">
                  <h3 className="line-clamp-1 text-base font-semibold text-foreground">
                    {course.title}
                  </h3>
                  <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground/80">
                    {course.description}
                  </p>
                  {course.instructor && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80">
                      <User className="size-3" />
                      <span>{course.instructor}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground/80">
                    <div className="flex items-center gap-1">
                      <Star className="size-3 fill-cyan-400 text-cyan-400" />
                      <span>{course.rating}</span>
                    </div>
                    {course.videoCount > 0 && (
                      <div className="flex items-center gap-1">
                        <Play className="size-3" />
                        <span>{course.videoCount} videos</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <GraduationCap className="size-3" />
                      <span>{course.enrollmentCount} enrolled</span>
                    </div>
                    {!course.isFree && (
                      <div className="ml-auto text-xs font-semibold text-amber-400">
                        {course.price} Coins
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground/60">
                    <Calendar className="size-3" />
                    {enrollment?.createdAt
                      ? new Date(
                          enrollment.createdAt,
                        ).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : '—'}
                  </div>

                  <Button
                    variant="default"
                    className="mt-auto w-full bg-cyan-500 text-foreground hover:bg-cyan-400 active:scale-[0.96]"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/courses/${course.id}`);
                    }}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <BookOpen className="mb-4 size-12 text-muted-foreground/80" />
            <p className="text-lg text-muted-foreground">
              No courses found
            </p>
            <p className="mt-1 text-sm text-muted-foreground/80">
              Try adjusting your search or filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
