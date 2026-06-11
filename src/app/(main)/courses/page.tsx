"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, BookOpen, User, Star, Play, GraduationCap, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useGetCoursesQuery } from "@/store/api"
import { getYouTubeVideoId } from "@/lib/video"

const levelColors: Record<string, string> = {
  Beginner: "text-emerald-400 border-emerald-500/20",
  Intermediate: "text-amber-400 border-amber-500/20",
  Advanced: "text-rose-400 border-rose-500/20",
}

const levels = ["all", "beginner", "intermediate", "advanced"]
const typeFilters = ["all", "free", "paid"]

export default function CoursesPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [level, setLevel] = useState("all")
  const [type, setType] = useState("all")
  const [page, setPage] = useState(1)

  const { data, isLoading } = useGetCoursesQuery({
    page,
    limit: 12,
    search: search || undefined,
    type: type === 'all' ? undefined : type,
    level: level === 'all' ? undefined : level,
  })

  const courses = data?.courses ?? []
  const totalPages = data?.totalPages ?? 1

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-balance text-2xl font-bold text-foreground">Courses</h1>
          <p className="mt-1 text-sm text-muted-foreground">Master the art of Gurmat Sangeet</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="border-border bg-background pl-10 text-muted-foreground placeholder:text-muted-foreground/80"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Tabs value={level} onValueChange={(v) => { setLevel(v); setPage(1) }}>
          <TabsList className="flex gap-3 bg-transparent p-0">
            {levels.map((l) => (
              <TabsTrigger
                key={l}
                value={l}
                className="rounded-full border border-border/50 px-4 py-1.5 text-xs font-medium text-muted-foreground capitalize transition-all duration-200 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm hover:border-border hover:text-foreground"
              >
                {l}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Tabs value={type} onValueChange={(v) => { setType(v); setPage(1) }}>
          <TabsList className="flex gap-3 bg-transparent p-0">
            {typeFilters.map((t) => (
              <TabsTrigger
                key={t}
                value={t}
                className="rounded-full border border-border/50 px-4 py-1.5 text-xs font-medium text-muted-foreground capitalize transition-all duration-200 data-[state=active]:border-cyan-500/50 data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400 data-[state=active]:shadow-sm hover:border-border hover:text-foreground"
              >
                {t === 'free' ? 'Free' : t === 'paid' ? 'Paid' : 'All Prices'}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="mt-8 mb-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-8 animate-spin text-muted-foreground/60" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => {
                const thumbSrc = course.thumbnail
                  ?? (getYouTubeVideoId(course.videos?.[0]?.videoUrl)
                    ? `https://img.youtube.com/vi/${getYouTubeVideoId(course.videos[0].videoUrl)}/maxresdefault.jpg`
                    : null)

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
                            const img = e.currentTarget
                            if (img.src.includes('maxresdefault')) {
                              img.src = img.src.replace('maxresdefault', 'hqdefault')
                            } else {
                              img.style.display = 'none'
                              img.nextElementSibling?.classList.remove('hidden')
                            }
                          }}
                        />
                      ) : null}
                      <Badge
                        className="absolute left-2 top-2 border border-amber-500/30 bg-background/60 px-2 py-0.5 text-[10px] font-medium text-amber-400 uppercase tracking-wider backdrop-blur-sm"
                      >
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
                      <h3 className="line-clamp-1 text-base font-semibold text-foreground">{course.title}</h3>
                      <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground/80">{course.description}</p>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80">
                        <User className="size-3" />
                        <span>{course.instructor}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground/80">
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
                      <Button
                        variant="default"
                        className="mt-auto w-full bg-cyan-500 text-foreground hover:bg-cyan-400 active:scale-[0.96]"
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/courses/${course.id}`)
                        }}
                      >
                        {course.isEnrolled ? "Continue" : "View Course"}
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>

            {courses.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <BookOpen className="mb-4 size-12 text-muted-foreground/80" />
                <p className="text-lg text-muted-foreground">No courses found</p>
                <p className="mt-1 text-sm text-muted-foreground/80">Try adjusting your search or filter</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    variant={p === page ? "default" : "outline"}
                    size="sm"
                    className={p === page ? "bg-cyan-500 text-foreground hover:bg-cyan-400" : ""}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
