'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Play, Check, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useGetCourseByIdQuery } from '@/store/api';
import { YouTubeVideo } from '@/components/video/YouTubeVideo';
import { useAppSelector } from '@/store/hooks';

export default function LecturePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const videoId = params.videoId as string;

  const enrolledCourses = useAppSelector((s) => s.courses.enrolledCourses);
  const { data: course, isLoading, isError } = useGetCourseByIdQuery(courseId);

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center bg-[#050505]">
        <Loader2 className="size-8 animate-spin text-white/40" />
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center bg-[#050505] px-4 text-center">
        <h1 className="text-lg text-white/60">Course not found</h1>
        <Button
          variant="outline"
          onClick={() => router.push('/courses')}
          className="mt-4 border-white/[0.08] text-white/60"
        >
          Back to Courses
        </Button>
      </div>
    );
  }

  const isEnrolled = enrolledCourses.includes(course.id) || course.isEnrolled;

  useEffect(() => {
    if (!isEnrolled) {
      toast.error('Enroll to access this course');
      router.replace(`/courses/${course.id}`);
    }
  }, [isEnrolled, course, router]);

  const sortedVideos = [...course.videos]
    .sort((a, b) => a.order - b.order)
    .filter((v) => v.order !== 0);
  const currentIndex = sortedVideos.findIndex((v) => v.id === videoId);
  const currentVideo = sortedVideos[currentIndex];

  if (!currentVideo) {
    return (
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center bg-[#050505] px-4 text-center">
        <h1 className="text-lg text-white/60">Video not found</h1>
        <Button
          variant="outline"
          onClick={() => router.push(`/courses/${course.id}`)}
          className="mt-4 border-white/[0.08] text-white/60"
        >
          Back to Course
        </Button>
      </div>
    );
  }

  const prevVideo = currentIndex > 0 ? sortedVideos[currentIndex - 1] : null;
  const nextVideo =
    currentIndex < sortedVideos.length - 1
      ? sortedVideos[currentIndex + 1]
      : null;

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="mx-auto flex max-w-[1400px] flex-col lg:flex-row">
        <div className="flex-1 p-4 lg:p-6">
          <button
            onClick={() => router.replace(`/courses/${course.id}`)}
            className="mb-4 flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white/80"
          >
            <ArrowLeft className="size-4" />
            Back to Course
          </button>

          <div className="relative">
            <button
              onClick={() => router.replace(`/courses/${course.id}`)}
              className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-black/50 text-white/70 backdrop-blur-sm transition-colors hover:bg-black/70 hover:text-white"
            >
              <X className="size-4" />
            </button>
            <YouTubeVideo url={currentVideo.videoUrl} />
          </div>

          <div className="mt-4 space-y-2">
            <h1 className="text-lg font-semibold text-white lg:text-xl">
              {currentVideo.title}
            </h1>
            {currentVideo.description && (
              <p className="text-sm leading-relaxed text-[#9CA3AF]">
                {currentVideo.description}
              </p>
            )}
          </div>

          <div className="mt-6 flex items-center gap-3">
            {prevVideo && (
              <Button
                variant="outline"
                onClick={() =>
                  router.push(
                    `/courses/${course.id}/lecture/${prevVideo.id}`,
                  )
                }
                className="rounded-full border-white/[0.08] text-xs text-white/60 hover:text-white"
              >
                Previous
              </Button>
            )}
            {nextVideo && (
              <Button
                onClick={() =>
                  router.push(
                    `/courses/${course.id}/lecture/${nextVideo.id}`,
                  )
                }
                className="rounded-full bg-[#2CE6C8] text-xs font-semibold text-black hover:bg-[#2CE6C8]/90"
              >
                Next Lesson
              </Button>
            )}
          </div>
        </div>

        <div className="w-full border-t border-white/[0.06] lg:w-[380px] lg:shrink-0 lg:border-t-0 lg:border-l">
          <div className="p-4 lg:p-6">
            <h2 className="text-sm font-semibold text-white">
              {course.title}
            </h2>
            <p className="mt-0.5 text-xs text-[#6B7280]">
              {sortedVideos.length} lessons
            </p>
          </div>

          <div className="space-y-0.5 px-2 pb-6">
            {sortedVideos.map((video, i) => {
              const isCurrent = video.id === currentVideo.id;
              return (
                <button
                  key={video.id}
                  onClick={() =>
                    router.push(
                      `/courses/${course.id}/lecture/${video.id}`,
                    )
                  }
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                    isCurrent
                      ? 'bg-[#2CE6C8]/10'
                      : 'hover:bg-white/[0.04]'
                  }`}
                >
                  <div
                    className={`flex size-7 shrink-0 items-center justify-center rounded-full text-[11px] font-medium ${
                      isCurrent
                        ? 'bg-[#2CE6C8] text-black'
                        : 'bg-white/10 text-white/60'
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span
                    className={`text-sm leading-tight ${
                      isCurrent ? 'font-medium text-[#2CE6C8]' : 'text-white/70'
                    }`}
                  >
                    {video.title}
                  </span>
                  {isCurrent && (
                    <Play
                      className="ml-auto size-3 shrink-0 text-[#2CE6C8]"
                      fill="currentColor"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
