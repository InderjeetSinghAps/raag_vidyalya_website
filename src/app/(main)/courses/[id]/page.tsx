"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, BookOpen, User, Star, Play, GraduationCap, Check, Loader2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { enrollCourse } from "@/store/coursesSlice"
import { useGetCourseByIdQuery } from "@/store/api"
import { getYouTubeVideoId } from "@/lib/video"

const levelColors: Record<string, string> = {
  Beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Advanced: "bg-rose-500/10 text-rose-400 border-rose-500/20",
}

function getVideoThumbnail(videoUrl: string): string | null {
  const id = getYouTubeVideoId(videoUrl)
  if (!id) return null
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
}

function StarRating({ average, count }: { average: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`size-3.5 ${s <= Math.round(average) ? 'fill-cyan-400 text-cyan-400' : 'text-muted-foreground/30'}`}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">{average.toFixed(1)} ({count})</span>
    </div>
  )
}

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const enrolledCourses = useAppSelector((s) => s.courses.enrolledCourses)

  const { data: course, isLoading } = useGetCourseByIdQuery(params.id as string)

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-4xl items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
        <Loader2 className="size-8 animate-spin text-muted-foreground/60" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <BookOpen className="mb-4 size-12 text-muted-foreground/80" />
          <p className="text-lg text-muted-foreground">Course not found</p>
          <Button
            variant="outline"
            className="mt-4 border-border text-muted-foreground"
            onClick={() => router.push("/courses")}
          >
            Back to Courses
          </Button>
        </div>
      </div>
    )
  }

  const isEnrolled = enrolledCourses.includes(course.id) || course.isEnrolled

  const handleEnroll = () => {
    dispatch(enrollCourse(course.id))
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <button
        onClick={() => router.push("/courses")}
        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground/80 transition-colors hover:text-muted-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Courses
      </button>

      {course.thumbnail && (
        <div className="mb-6 flex h-64 items-center justify-center overflow-hidden rounded-xl bg-background sm:h-100">
          <img
            src={course.thumbnail}
            alt={course.title}
            referrerPolicy="no-referrer"
            className=" object-cover"
          />
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{course.title}</h1>

        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground/80">
          {course.instructorAvatar ? (
            <img
              src={course.instructorAvatar}
              alt=""
              referrerPolicy="no-referrer"
              className="size-7 rounded-full object-cover"
            />
          ) : (
            <div className="flex size-7 items-center justify-center rounded-full bg-muted">
              <User className="size-3.5 text-muted-foreground/60" />
            </div>
          )}
          <span>{course.instructor}</span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <StarRating average={course.rating} count={course.ratingCount} />
          <div className="flex items-center gap-1 text-xs text-muted-foreground/80">
            <GraduationCap className="size-3.5" />
            <span>{course.enrollmentCount} enrolled</span>
          </div>
          <Badge variant="outline" className="border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
            {course.category}
          </Badge>
          <Badge className={`border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${levelColors[course.level] || ''}`}>
            {course.level}
          </Badge>
          {course.isFree ? (
            <span className="text-sm font-medium text-emerald-400">Free</span>
          ) : (
            <span className="text-sm font-semibold text-amber-400">{course.price} Coins</span>
          )}
        </div>
      </div>

      <p className="mb-8 leading-relaxed text-muted-foreground">{course.description}</p>

      {course.tags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {course.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {course.benefits.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-foreground">What you&apos;ll learn</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {course.benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="mt-0.5 size-4 shrink-0 text-cyan-400" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {course.prerequisites.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-foreground">Prerequisites</h2>
          <ul className="space-y-1.5">
            {course.prerequisites.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {course.learningOutcomes.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-foreground">Learning outcomes</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {course.learningOutcomes.map((o, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="mt-0.5 size-4 shrink-0 text-cyan-400" />
                <span>{o}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {course.videos.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Course content</h2>
          <div className="space-y-3">
            {[...course.videos]
              .sort((a, b) => a.order - b.order)
              .map((video) => {
                const thumb = getVideoThumbnail(video.videoUrl)
                return (
                  <div
                    key={video.id}
                    className="flex gap-4 rounded-xl border border-border bg-background p-4"
                  >
                    <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted sm:size-32">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="size-full object-cover"
                          onError={(e) => {
                            const img = e.currentTarget
                            if (img.src.includes('maxresdefault')) {
                              img.src = img.src.replace('maxresdefault', 'hqdefault')
                            } else {
                              img.style.display = 'none'
                            }
                          }}
                        />
                      ) : (
                        <Play className="size-6 text-muted-foreground/50" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <h4 className="text-sm font-medium text-foreground">{video.title}</h4>
                      {video.description && (
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground/80 line-clamp-2">{video.description}</p>
                      )}
                    </div>
                  </div>
                )
              })}
          </div>
        </section>
      )}

      <Button
        variant="default"
        className="w-full bg-cyan-500 text-foreground hover:bg-cyan-400 sm:w-auto"
        size="lg"
        onClick={handleEnroll}
      >
        <ShieldCheck className="size-4" />
        {isEnrolled ? "Continue Learning" : course.isFree ? "Enroll for Free" : "Enroll Now"}
      </Button>
    </div>
  )
}
