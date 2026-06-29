'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  User,
  Star,
  Play,
  GraduationCap,
  Check,
  Loader2,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Award,
  Hash,
  BarChart3,
  Sparkles,
  ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { enrollCourse } from '@/store/coursesSlice';
import {
  useGetCourseByIdQuery,
  useGetCoursesQuery,
  useEnrollCourseMutation,
  useGetMyEnrollmentsQuery,
} from '@/store/api';
import { toast } from 'sonner';
import { getYouTubeVideoId } from '@/lib/video';

function getVideoThumbnail(videoUrl: string): string | null {
  const id = getYouTubeVideoId(videoUrl);
  if (!id) return null;
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const enrolledCourses = useAppSelector(
    (s) => s.courses.enrolledCourses,
  );
  const [expandedLesson, setExpandedLesson] = useState<string | null>(
    null,
  );
  const [enrollCourseApi, { isLoading: isEnrolling }] =
    useEnrollCourseMutation();
  const [heroQuality, setHeroQuality] = useState<
    'maxresdefault' | 'hqdefault'
  >('maxresdefault');

  const { data: course, isLoading } = useGetCourseByIdQuery(
    params.id as string,
  );

  const { data: relatedData } = useGetCoursesQuery(
    { limit: 20 },
    { skip: !course },
  );
  const relatedCourses = relatedData
    ? relatedData.courses
        .filter(
          (c) =>
            c.id !== course?.id && c.category === course?.category,
        )
        .slice(0, 3)
    : [];

  const { data: enrollmentsData } = useGetMyEnrollmentsQuery(
    { page: 1, limit: 50 },
    { skip: !course },
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505]">
        <Loader2 className="size-8 animate-spin text-white/60" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505]">
        <div className="flex flex-col items-center gap-4 text-center">
          <BookOpen className="size-12 text-white/30" />
          <p className="text-lg text-white/50">Course not found</p>
          <Button
            variant="outline"
            className="border-white/10 text-white/70 hover:bg-white/5"
            onClick={() => router.back()}
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

  const isEnrolled =
    enrolledCourses.includes(course.id) || course.isEnrolled;
  const firstVideo =
    course.videos.length > 0
      ? [...course.videos]
          .sort((a, b) => a.order - b.order)
          .filter((v) => v.order !== 0)[0]
      : null;
  const hasRating = course.ratingCount > 0;
  const heroImageSrc =
    course.thumbnail ??
    (firstVideo?.videoUrl && getYouTubeVideoId(firstVideo.videoUrl)
      ? `https://img.youtube.com/vi/${getYouTubeVideoId(firstVideo.videoUrl)}/${heroQuality}.jpg`
      : null);

  const enrollment =
    isEnrolled && enrollmentsData
      ? enrollmentsData.enrollments?.find(
          (e) => e.course?.id === course.id,
        )
      : undefined;
  const progressPercent =
    enrollment?.progress?.completionPercentage ?? 0;

  const handleEnroll = async () => {
    if (isEnrolled) {
      router.push(
        `/courses/${course.id}/lecture/${firstVideo?.id || ''}`,
      );
      return;
    }
    try {
      await enrollCourseApi({ courseId: course.id }).unwrap();
      dispatch(enrollCourse(course.id));
      toast.success('Enrolled successfully!');
    } catch (err) {
      const apiError = err as { data?: { message?: string } };
      toast.error(
        apiError?.data?.message ||
          'Failed to enroll. Please try again.',
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* ── Hero ── */}
      <div className="relative h-[500px] w-full overflow-hidden">
        {heroImageSrc ? (
          <>
            <div
              className="absolute inset-0 bg-cover bg-top size-full"
              style={{ backgroundImage: `url(${heroImageSrc})` }}
            />
            <img
              src={heroImageSrc}
              alt=""
              className="hidden size-full"
              onError={(e) => {
                const img = e.currentTarget;
                if (img.src.includes('maxresdefault')) {
                  setHeroQuality('hqdefault');
                } else {
                  img.style.display = 'none';
                }
              }}
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0D1022]">
            <ImageIcon className="size-20 text-white/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 to-black/80" />

        <button
          onClick={() => router.back()}
          className="absolute left-8 top-8 flex size-14 items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10 transition-all duration-200 hover:bg-black/50 hover:scale-105"
        >
          <ArrowLeft className="size-6 text-white" />
        </button>

        <div className="absolute bottom-8 left-8 rounded-full bg-white/[0.08] px-6 py-3 border border-white/20 text-sm font-medium text-white uppercase tracking-wider backdrop-blur-sm">
          {course.level}
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="mx-auto max-w-[1400px] px-4 lg:px-12 pb-32">
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-10 items-start">
          {/* ══════ MAIN CONTENT ══════ */}
          <div>
            {/* Title */}
            <h1 className="text-xl lg:text-2xl font-bold text-white leading-tight">
              {course.title}
            </h1>

            {/* ── METADATA ROW ── */}
            <div className="mt-5 lg:mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#2CE6C8]/10 px-4 py-2 text-sm font-medium text-[#2CE6C8]">
                <GraduationCap className="size-4" />
                {course.level}
              </span>
              <span className="inline-flex items-center gap-2 text-sm text-[#9CA3AF]">
                <Play className="size-4" />
                {course.videoCount} Lessons
              </span>
              <span className="inline-flex items-center gap-2 text-sm text-[#9CA3AF]">
                <User className="size-4" />
                {course.enrollmentCount} Students
              </span>
              <span className="inline-flex items-center gap-2 text-sm text-[#9CA3AF]">
                <Award className="size-4" />
                {course.isFree
                  ? 'Free'
                  : `${course.price} ${course.price === 1 ? 'Coin' : 'Coins'}`}
              </span>
              <span className="inline-flex items-center gap-2 text-sm">
                {hasRating ? (
                  <>
                    <Star
                      className="size-4 text-yellow-400"
                      fill="currentColor"
                    />
                    <span className="text-yellow-400 font-medium">
                      {course.rating.toFixed(1)}
                    </span>
                    <span className="text-[#9CA3AF]">
                      ({course.ratingCount})
                    </span>
                  </>
                ) : (
                  <p></p>
                )}
              </span>
            </div>

            {/* ── INSTRUCTOR CARD (140px) ── */}
            <div className="mt-8 flex h-auto items-center gap-4 lg:gap-5 rounded-3xl bg-[#0B1020] p-4 lg:p-3 shadow-[0_15px_40px_rgba(0,0,0,.4)]">
              {course.instructorAvatar ? (
                <img
                  src={course.instructorAvatar}
                  alt={course.instructor}
                  referrerPolicy="no-referrer"
                  className="size-[60px] lg:size-[72px] shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex size-[60px] lg:size-[72px] shrink-0 items-center justify-center rounded-full bg-white/5">
                  <User className="size-6 lg:size-8 text-white/40" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center flex-wrap gap-2">
                  <p className="text-base lg:text-lg font-semibold text-white ">
                    {course.instructor}
                  </p>
                  {course.instructorProfession && (
                    <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-medium text-amber-400 whitespace-nowrap">
                      {course.instructorProfession}
                    </span>
                  )}
                </div>
                {course.instructorEmail && (
                  <p className="mt-0.5 text-[10px] lg:text-[11px] text-[#6B7280] truncate">
                    {course.instructorEmail}
                  </p>
                )}
                {course.instructorPhone && (
                  <p className="text-[11px] lg:text-xs text-[#6B7280]">
                    {course.instructorPhone}
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                className="shrink-0 rounded-full border-[#2CE6C8]/30 text-[#2CE6C8] hover:bg-[#2CE6C8]/10 text-sm"
              >
                View Profile
              </Button>
            </div>

            {/* ── QUICK FACTS (4-column grid) ── */}
            <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              {[
                {
                  label: 'Level',
                  value: course.level,
                  icon: BarChart3,
                },
                {
                  label: 'Videos',
                  value: `${course.videoCount}`,
                  icon: Play,
                },
                {
                  label: 'Category',
                  value: course.category,
                  icon: BookOpen,
                },
                {
                  label: 'Price',
                  value: course.isFree
                    ? 'Free'
                    : `${course.price} ${course.price === 1 ? 'Coin' : 'Coins'}`,
                  icon: ShieldCheck,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center justify-center gap-1.5 lg:gap-2 rounded-2xl bg-[#0D1022] py-5 lg:py-6 px-3 text-center"
                >
                  <item.icon className="size-4 lg:size-5 text-[#2CE6C8]" />
                  <p className="text-xs lg:text-sm font-semibold text-white truncate max-w-full">
                    {item.value}
                  </p>
                  <p className="text-[10px] lg:text-xs text-[#8A8A8A]">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            {/* ── ABOUT ── */}
            <section className="mt-10 lg:mt-12">
              <h2 className="text-base lg:text-lg tracking-wide font-medium text-white">
                About this course
              </h2>
              <p className="mt-4 max-w-[850px] text-sm lg:text-base leading-relaxed text-[#B0B0B0]">
                {course.description}
              </p>
            </section>

            {/* ── LEARNING OUTCOMES ── */}
            {course.benefits.length > 0 && (
              <section className="mt-10 lg:mt-14">
                <h2 className="text-base lg:text-lg tracking-wide font-medium text-white">
                  Learning Outcomes
                </h2>
                <div className="mt-5 lg:mt-6 space-y-4 lg:space-y-5">
                  {course.benefits.map((b, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 lg:gap-4"
                    >
                      <div className="flex size-6 lg:size-7 shrink-0 items-center justify-center rounded-full bg-[#2CE6C8]/20">
                        <Check className="size-3.5 lg:size-4 text-[#2CE6C8]" />
                      </div>
                      <span className="text-sm lg:text-sm leading-relaxed text-[#C8C8C8]">
                        {b}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── CURRICULUM ACCORDION ── */}
            {course.videos.length > 0 && (
              <section className="mt-10 lg:mt-14">
                <h2 className="text-base lg:text-lg tracking-wide font-medium text-white">
                  Course Curriculum
                </h2>
                <p className="mt-1 text-sm lg:text-base text-[#6B7280]">
                  {course.videoCount} video
                  {course.videoCount !== 1 ? 's' : ''} &bull; Learn at
                  your own pace
                </p>
                <div className="mt-5 lg:mt-6 space-y-3">
                  {[...course.videos]
                    .sort((a, b) => a.order - b.order)
                    .filter((video) => video.order !== 0)
                    .map((video) => {
                      const isExpanded = expandedLesson === video.id;
                      const thumb = getVideoThumbnail(video.videoUrl);

                      return (
                        <div
                          key={video.id}
                          className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0D1022] transition-all duration-200"
                        >
                          <button
                            onClick={() =>
                              setExpandedLesson(
                                isExpanded ? null : video.id,
                              )
                            }
                            className="flex h-[72px] w-full items-center gap-3 lg:gap-4 px-4 lg:px-6 text-left transition-colors hover:bg-white/[0.03]"
                          >
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#2CE6C8]/10">
                              <Play className="size-3.5 text-[#2CE6C8]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] lg:text-xs text-[#2CE6C8] font-medium">
                                Lesson {video.order}
                              </p>
                              <p className="text-xs lg:text-sm font-medium text-white truncate">
                                {video.title}
                              </p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              {isExpanded ? (
                                <ChevronUp className="size-4 lg:size-5 text-white/40" />
                              ) : (
                                <ChevronDown className="size-4 lg:size-5 text-white/40" />
                              )}
                            </div>
                          </button>

                          {isExpanded && (
                            <div className="border-t border-white/[0.06] px-4 lg:px-6 py-4 lg:py-5">
                              <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                                {thumb && (
                                  <div className="relative w-full lg:w-[180px] h-[200px] lg:h-[120px] shrink-0 overflow-hidden rounded-xl bg-black/40">
                                    <img
                                      src={thumb}
                                      alt=""
                                      referrerPolicy="no-referrer"
                                      className="size-full object-cover"
                                      onError={(e) => {
                                        const img = e.currentTarget;
                                        if (
                                          img.src.includes(
                                            'maxresdefault',
                                          )
                                        ) {
                                          img.src = img.src.replace(
                                            'maxresdefault',
                                            'hqdefault',
                                          );
                                        }
                                      }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                      <Play
                                        className="size-8 text-white"
                                        fill="white"
                                      />
                                    </div>
                                  </div>
                                )}
                                <div className="flex flex-col justify-between flex-1">
                                  <div>
                                    <p className="text-sm lg:text-base font-medium text-white">
                                      {video.title}
                                    </p>
                                    {video.description && (
                                      <p className="mt-2 text-sm leading-relaxed text-[#A0A0A0] max-w-[500px]">
                                        {video.description}
                                      </p>
                                    )}
                                  </div>
                                  <Button
                                    onClick={() => {
                                      if (!isEnrolled) {
                                        toast.info(
                                          'Enroll to access this course',
                                        );
                                        return;
                                      }
                                      router.push(
                                        `/courses/${course.id}/lecture/${video.id}`,
                                      );
                                    }}
                                    className="mt-4 lg:mt-0 w-fit rounded-full bg-[#2CE6C8] text-sm font-semibold text-black hover:bg-[#2CE6C8]/90"
                                  >
                                    <Play
                                      className="mr-2 size-4"
                                      fill="currentColor"
                                    />
                                    Watch Lesson
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </section>
            )}

            {/* ── PREREQUISITES: "Before You Start" ── */}
            {course.prerequisites.length > 0 && (
              <section className="mt-10 lg:mt-14">
                <h2 className="text-base lg:text-lg tracking-wide font-medium text-white">
                  Before You Start
                </h2>
                <div className="mt-5 rounded-3xl border border-white/[0.08] bg-[#0D1022] p-5 lg:p-6">
                  <ul className="space-y-3 lg:space-y-4">
                    {course.prerequisites.map((p, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-xs lg:text-sm text-[#B0B0B0]"
                      >
                        <span className="mt-2 size-2 shrink-0 rounded-full bg-[#2CE6C8]" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* ── CLICKABLE TAG PILLS ── */}
            {course.tags.length > 0 && (
              <section className="mt-10 lg:mt-14">
                <h2 className="text-xs lg:text-sm font-semibold uppercase tracking-widest text-[#6B7280] mb-4">
                  Tags
                </h2>
                <div className="flex flex-wrap gap-3">
                  {course.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/courses?tag=${encodeURIComponent(tag)}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(0,255,180,.25)] bg-[rgba(0,255,180,.08)] px-3 lg:px-4 py-1.5 lg:py-2 text-xs font-medium text-[#2CE6C8] transition-all duration-200 hover:bg-[rgba(0,255,180,.15)] hover:-translate-y-0.5"
                    >
                      <Hash className="size-3.5" />
                      {tag}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* ── RELATED COURSES ── */}
            {relatedCourses.length > 0 && (
              <section className="mt-12 lg:mt-16">
                <h2 className="text-base lg:text-lg tracking-wide font-medium text-white">
                  Related Courses
                </h2>
                <div className="mt-5 lg:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                  {relatedCourses.map((rel) => (
                    <button
                      key={rel.id}
                      onClick={() =>
                        router.push(`/courses/${rel.id}`)
                      }
                      className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0D1022] text-left transition-all duration-200 hover:border-[#2CE6C8]/30 hover:-translate-y-1"
                    >
                      <div className="relative h-[130px] lg:h-[140px] overflow-hidden">
                        {rel.thumbnail ? (
                          <img
                            src={rel.thumbnail}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center bg-black/40">
                            <BookOpen className="size-8 text-white/30" />
                          </div>
                        )}
                        <div className="absolute bottom-2 left-2">
                          <span className="rounded-full bg-black/60 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                            {rel.level}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="font-medium text-white text-xs lg:text-sm line-clamp-2">
                          {rel.title}
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-xs text-[#6B7280]">
                          <Play className="size-3" />
                          <span>{rel.videoCount} lessons</span>
                          <span className="text-white/10">
                            &bull;
                          </span>
                          <span>
                            {rel.isFree
                              ? 'Free'
                              : `${rel.price} ${rel.price === 1 ? 'Coin' : 'Coins'}`}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ══════ SIDEBAR ══════ */}
          <div className="lg:sticky lg:top-[88px]">
            <div className="rounded-[30px] bg-[#0D1022] p-6 lg:p-8 shadow-[0_20px_60px_rgba(0,0,0,.45)]">
              <div className="text-center">
                <p className="text-2xl lg:text-3xl font-bold text-[#2CE6C8]">
                  {course.isFree ? 'FREE' : `${course.price}`}
                </p>
                {!course.isFree && (
                  <p className="text-sm lg:text-base text-[#9CA3AF]">
                    {course.price === 1 ? 'Coin' : 'Coins'}
                  </p>
                )}
                <p className="text-sm lg:text-base text-[#9CA3AF]">
                  Full Access
                </p>
              </div>

              <Button
                className="mt-6 h-[60px] lg:h-[72px] w-full rounded-[20px] bg-[#2CE6C8] text-sm lg:text-base font-medium text-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2CE6C8]/90 active:scale-[0.98]"
                disabled={isEnrolling}
                onClick={handleEnroll}
              >
                {isEnrolling ? (
                  <Loader2 className="mr-2 size-5 animate-spin lg:size-6" />
                ) : (
                  <ShieldCheck className="mr-2 size-5 lg:size-6" />
                )}
                {isEnrolled
                  ? 'Continue Learning'
                  : isEnrolling
                    ? 'Enrolling...'
                    : 'Enroll Now'}
              </Button>

              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between rounded-xl bg-white/[0.04] px-4 py-3">
                  <span className="text-sm text-[#9CA3AF]">
                    Lessons
                  </span>
                  <span className="text-sm font-medium text-white">
                    {course.videoCount}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-white/[0.04] px-4 py-3">
                  <span className="text-sm text-[#9CA3AF]">
                    Level
                  </span>
                  <span className="text-sm font-medium text-white">
                    {course.level}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-white/[0.04] px-4 py-3">
                  <span className="text-sm text-[#9CA3AF]">
                    Category
                  </span>
                  <span className="text-sm font-medium text-white">
                    {course.category}
                  </span>
                </div>
                {course.requiresSubscriptionOrPurchase && (
                  <div className="flex items-center justify-between rounded-xl bg-white/[0.04] px-4 py-3">
                    <span className="text-sm text-[#9CA3AF]">
                      Access
                    </span>
                    <span className="text-sm font-medium text-[#2CE6C8]">
                      Premium
                    </span>
                  </div>
                )}
              </div>

              {!isEnrolled && (
                <div className="mt-6 rounded-xl bg-[#2CE6C8]/5 px-4 py-3">
                  <p className="text-xs leading-relaxed text-[#9CA3AF]">
                    By enrolling you agree to our terms of service and
                    privacy policy.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── STICKY PROGRESS BAR (enrolled only) ── */}
      {/* {isEnrolled && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.08] bg-[#0B1020]/95 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1400px] items-center gap-4 lg:gap-6 px-4 lg:px-12 py-3 lg:py-4">
            <div className="flex flex-1 items-center gap-3 lg:gap-4 min-w-0">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#2CE6C8]/10">
                <Play
                  className="size-5 text-[#2CE6C8]"
                  fill="currentColor"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">
                  {firstVideo
                    ? firstVideo.title
                    : 'Continue Learning'}
                </p>
                <div className="mt-1 flex items-center gap-3">
                  <div className="h-1.5 flex-1 max-w-[300px] overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-[#2CE6C8] transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="text-xs text-[#6B7280] shrink-0">
                    {Math.round(progressPercent)}% Complete
                  </span>
                </div>
              </div>
            </div>
            <Button
              onClick={() =>
                router.push(
                  `/courses/${course.id}/lecture/${firstVideo?.id || ''}`,
                )
              }
              className="shrink-0 rounded-full bg-[#2CE6C8] px-6 lg:px-8 text-sm font-semibold text-black hover:bg-[#2CE6C8]/90"
            >
              {firstVideo ? 'Continue' : 'Start Course'}
            </Button>
          </div>
        </div>
      )} */}
    </div>
  );
}
