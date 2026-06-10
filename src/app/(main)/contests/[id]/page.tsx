"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Trophy, Calendar, Users, ListChecks, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { contests } from "@/data"

const statusBadge: Record<string, string> = {
  active: "border-green-500/30 bg-green-500/10 text-green-400",
  upcoming: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  completed: "border-[#64748B]/30 bg-[#64748B]/10 text-[#64748B]",
}

function getDaysLeft(deadline: string): string {
  const now = new Date()
  const target = new Date(deadline)
  const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  if (diff < 0) return "Ended"
  if (diff === 0) return "Today"
  if (diff === 1) return "1 day left"
  return `${diff} days left`
}

export default function ContestDetailPage() {
  const params = useParams()
  const router = useRouter()

  const contest = contests.find((c) => c.id === params.id)

  if (!contest) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Trophy className="mb-4 size-12 text-[#64748B]" />
          <p className="text-lg text-[#94A3B8]">Contest not found</p>
          <Button variant="outline" className="mt-4 border-[#1E293B] text-[#94A3B8]" onClick={() => router.push("/contests")}>
            Back to Contests
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <button
        onClick={() => router.push("/contests")}
        className="mb-6 flex items-center gap-2 text-sm text-[#64748B] transition-colors hover:text-[#94A3B8]"
      >
        <ArrowLeft className="size-4" />
        Back to Contests
      </button>

      <div className="mb-6 flex h-64 items-center justify-center rounded-xl bg-[#0B1220]">
        <ImageIcon className="size-16 text-[#64748B]" />
      </div>

      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">{contest.title}</h1>
            <Badge className={`mt-2 border text-xs ${statusBadge[contest.status] || ""}`}>
              {contest.status}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-lg font-semibold text-cyan-400">
          <Trophy className="size-5" />
          {contest.prize}
        </div>

        <p className="leading-relaxed text-[#94A3B8]">{contest.description}</p>

        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2 rounded-lg border border-[#1E293B] bg-[#0B1220] px-3 py-2 text-[#94A3B8]">
            <Calendar className="size-4 text-[#64748B]" />
            <span>Deadline: {contest.deadline}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-[#1E293B] bg-[#0B1220] px-3 py-2 text-[#94A3B8]">
            <Users className="size-4 text-[#64748B]" />
            <span>{contest.participants} participants</span>
          </div>
          <div className="rounded-lg border border-[#1E293B] bg-[#0B1220] px-3 py-2 text-sm">
            <span className="text-cyan-400 font-medium">{getDaysLeft(contest.deadline)}</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#1E293B] bg-[#0B1220] p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
            <ListChecks className="size-4 text-cyan-400" />
            Rules
          </h2>
          <ul className="space-y-2 text-sm text-[#94A3B8]">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[#64748B]" />
              Participants must register before the deadline
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[#64748B]" />
              Submissions must be original work
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[#64748B]" />
              Judges&apos; decision is final
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[#64748B]" />
              Winners will be announced on the deadline date
            </li>
          </ul>
        </div>

        {contest.status !== "completed" && (
          <Button className="w-full bg-cyan-500 text-black hover:bg-cyan-400">
            <Trophy className="size-4" />
            Participate Now
          </Button>
        )}
      </div>
    </div>
  )
}
