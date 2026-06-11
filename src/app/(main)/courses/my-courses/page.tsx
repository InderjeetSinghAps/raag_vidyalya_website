"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BookOpen, Clock, User, Star, Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppSelector } from "@/store/hooks"
import { useGetCoursesQuery } from "@/store/api"

export default function MyCoursesPage() {
  const router = useRouter()
  const enrolledIds = useAppSelector((s) => s.courses.enrolledCourses)
  const [search, setSearch] = useState("")
  const [level, setLevel] = useState("All")

  const { data, isLoading } = useGetCoursesQuery({ page: 1, limit: 50 })
  const allCourses = data?.courses ?? []

  const enrolledCourses = allCourses.filter((c) => enrolledIds.includes(c.id))

  const filtered = enrolledCourses.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.toLowerCase().includes(search.toLowerCase())
    const matchLevel = level === "All" || c.level === level
    return matchSearch && matchLevel
  })

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-8 animate-spin text-muted-foreground/60" />
        </div>
      </div>
    )
  }

  if (enrolledCourses.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-balance text-3xl font-bold text-foreground">My Courses</h1>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <BookOpen className="mb-4 size-16 text-muted-foreground/80" />
          <p className="text-lg text-muted-foreground">You haven&apos;t enrolled in any courses yet</p>
          <Button
            variant="default"
            className="mt-6 bg-cyan-500 text-foreground hover:bg-cyan-400 active:scale-[0.96]"
            onClick={() => router.push("/courses")}
          >
            Browse Courses
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-balance text-2xl font-bold text-foreground">My Courses</h1>
          <p className="mt-1 text-sm text-muted-foreground">Continue your learning journey</p>
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

      <Tabs value={level} onValueChange={setLevel}>
        <TabsList className="flex w-full justify-center gap-3 bg-transparent p-0">
          {["All", "Beginner", "Intermediate", "Advanced"].map((l) => (
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

      <div className="mt-8 mb-4">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => (
            <Card
              key={course.id}
              size="sm"
              className="border-border bg-background"
            >
              <div className="flex h-36 items-center justify-center overflow-hidden rounded-t-xl bg-background">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    referrerPolicy="no-referrer"
                    className="size-full object-cover"
                  />
                ) : (
                  <BookOpen className="size-12 text-cyan-400/30" />
                )}
              </div>
              <CardContent className="space-y-3">
                <h3 className="text-base font-semibold text-foreground">{course.title}</h3>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80">
                  <User className="size-3" />
                  <span>{course.instructor}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground/80">
                  <div className="flex items-center gap-1">
                    <Star className="size-3 fill-cyan-400 text-cyan-400" />
                    <span>{course.rating}</span>
                  </div>
                  <span className="text-muted-foreground/50">|</span>
                  <span>{course.videoCount} videos</span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground/80">Progress</span>
                    <span className="text-cyan-400">33%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-1/3 rounded-full bg-cyan-500 transition-all" />
                  </div>
                </div>

                <Button
                  variant="default"
                  className="w-full bg-cyan-500 text-foreground hover:bg-cyan-400 active:scale-[0.96]"
                  onClick={() => router.push(`/courses/${course.id}`)}
                >
                  Continue
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <BookOpen className="mb-4 size-12 text-muted-foreground/80" />
            <p className="text-lg text-muted-foreground">No courses found</p>
            <p className="mt-1 text-sm text-muted-foreground/80">Try adjusting your search or filter</p>
          </div>
        )}
      </div>
    </div>
  )
}
