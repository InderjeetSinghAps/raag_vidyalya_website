"use client"

import { useRouter } from "next/navigation"
import { Music2, Play, Sparkles, TrendingUp, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const QUICK_EXERCISES = [
  { title: 'Alankar', desc: 'Note patterns for voice control', icon: Music2, color: 'from-amber-500/20 to-amber-600/10' },
  { title: 'Sargam', desc: 'Scale practice (Sa Re Ga Ma)', icon: Sparkles, color: 'from-emerald-500/20 to-emerald-600/10' },
  { title: 'Voice Training', desc: 'Breath & pitch exercises', icon: TrendingUp, color: 'from-cyan-500/20 to-cyan-600/10' },
]

export default function RiyazPage() {
  const router = useRouter()

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Daily Riyaz</h1>
        <p className="mt-1 text-sm text-[#6B7280]">Your daily practice companion</p>
      </div>

      <div className="relative mb-6 overflow-hidden rounded-3xl border border-[rgba(212,160,23,.2)] p-6 text-center"
        style={{
          background: 'radial-gradient(circle at top right, rgba(212,160,23,.18), transparent 45%), linear-gradient(180deg, rgba(10,20,50,.95), rgba(3,8,23,1))'
        }}
      >
        <div className="pointer-events-none absolute -top-20 right-0 size-[300px] rounded-full bg-[rgba(212,160,23,.08)] blur-[80px]" />
        <div className="relative z-10">
          <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-[rgba(212,160,23,.15)] shadow-[0_0_20px_rgba(212,160,23,.2)]">
            <Music2 className="size-6 text-amber-400" />
          </div>
          <h2 className="text-base font-semibold text-white">Today&apos;s Riyaz</h2>
          <p className="mt-1 text-xs text-[#6B7280]">15 min • Raag Yaman • Alankar</p>
          <Button
            onClick={() => router.push('/riyaz/tanpura?note=C%23')}
            className="mt-4 h-12 w-full rounded-xl bg-[#D4A017] text-sm font-semibold text-white transition-all duration-200 hover:bg-[#B88914] hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(212,160,23,.35)] active:scale-[0.98]"
          >
            <Play className="mr-2 size-4" />
            Start Practice
          </Button>
        </div>
      </div>

      <div
        onClick={() => router.push('/riyaz/tanpura')}
        className="mb-6 flex cursor-pointer items-center gap-4 rounded-2xl border border-[rgba(212,160,23,.15)] bg-[#0B1020] p-4 transition-all hover:border-[rgba(212,160,23,.3)] hover:shadow-[0_0_20px_rgba(212,160,23,.06)]"
      >
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[rgba(212,160,23,.1)]">
          <Music2 className="size-5 text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white">Tanpura</p>
          <p className="text-xs text-[#6B7280]">Current: C# • 277.2 Hz</p>
        </div>
        <ArrowRight className="size-4 shrink-0 text-amber-400/60" />
      </div>

      <h3 className="mb-3 text-sm font-semibold text-white">Quick Exercises</h3>
      <div className="space-y-3">
        {QUICK_EXERCISES.map((exercise) => (
          <div
            key={exercise.title}
            className="flex cursor-pointer items-center gap-4 rounded-2xl border border-white/5 bg-[#0B1020] p-4 transition-all hover:border-white/10"
          >
            <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${exercise.color}`}>
              <exercise.icon className="size-5 text-white/80" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">{exercise.title}</p>
              <p className="text-xs text-[#6B7280]">{exercise.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-white/5 bg-[#0B1020] p-4">
        <div className="flex items-center gap-3">
          <Clock className="size-4 text-amber-400/60" />
          <p className="text-xs font-medium text-white/80">Practice Streak</p>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-2xl font-bold text-amber-400">0</span>
          <span className="text-xs text-[#6B7280]">days</span>
        </div>
      </div>
    </div>
  )
}
