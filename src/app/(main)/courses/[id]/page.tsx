"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, BookOpen, Clock, User, Star, Plus, Minus, Check, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { enrollCourse } from "@/store/coursesSlice"
import { courses } from "@/data"

const levelColors: Record<string, string> = {
  Beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Advanced: "bg-rose-500/10 text-rose-400 border-rose-500/20",
}

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const enrolledCourses = useAppSelector((s) => s.courses.enrolledCourses)

  const course = courses.find((c) => c.id === params.id)
  const [openModules, setOpenModules] = useState<string[]>([])

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <BookOpen className="mb-4 size-12 text-[#64748B]" />
        <p className="text-lg text-[#94A3B8]">Course not found</p>
        <Button
          variant="outline"
          className="mt-4 border-[#1E293B] text-[#94A3B8]"
          onClick={() => router.push("/courses")}
        >
          Back to Courses
        </Button>
      </div>
    )
  }

  const isEnrolled = enrolledCourses.includes(course.id)

  const toggleModule = (id: string) => {
    setOpenModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    )
  }

  const handleEnroll = () => {
    dispatch(enrollCourse(course.id))
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <button
        onClick={() => router.push("/courses")}
        className="mb-6 flex items-center gap-2 text-sm text-[#64748B] transition-colors hover:text-[#94A3B8]"
      >
        <ArrowLeft className="size-4" />
        Back to Courses
      </button>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">{course.title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-[#94A3B8]">{course.description}</p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#64748B]">
            <div className="flex items-center gap-1.5">
              <User className="size-3.5" />
              <span>{course.instructor}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="size-3.5" />
              <span>{course.duration}</span>
            </div>
            <Badge
              className={`border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${levelColors[course.level]}`}
            >
              {course.level}
            </Badge>
            <div className="flex items-center gap-1">
              <Star className="size-3.5 fill-cyan-400 text-cyan-400" />
              <span className="text-[#94A3B8]">{course.rating}</span>
            </div>
            <span className="text-sm font-semibold text-white">₹{course.price}</span>
          </div>
        </div>
      </div>

      <Button
        variant="default"
        className="mb-10 w-full bg-cyan-500 text-black hover:bg-cyan-400 sm:w-auto"
        onClick={handleEnroll}
      >
        {isEnrolled ? "Continue Learning" : "Enroll Now"}
      </Button>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">Modules</h2>
        <div className="space-y-3">
          {course.modules.map((mod) => {
            const isOpen = openModules.includes(mod.id)
            return (
              <div
                key={mod.id}
                className="overflow-hidden rounded-xl border border-[#1E293B] bg-[#0B1220]"
              >
                <button
                  onClick={() => toggleModule(mod.id)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-white/[0.02]"
                >
                  <span className="text-sm font-medium text-white">{mod.title}</span>
                  {isOpen ? (
                    <Minus className="size-4 text-[#64748B]" />
                  ) : (
                    <Plus className="size-4 text-[#64748B]" />
                  )}
                </button>
                {isOpen && (
                  <div className="border-t border-[#1E293B] px-5 py-3">
                    {mod.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center gap-3 py-2.5"
                      >
                        <div className="flex size-6 items-center justify-center rounded-full border border-[#1E293B] bg-[#000000]">
                          <Check className="size-3 text-[#64748B]" />
                        </div>
                        <div className="flex flex-1 items-center justify-between">
                          <span className="text-sm text-[#94A3B8]">{lesson.title}</span>
                          <span className="text-xs text-[#64748B]">{lesson.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
