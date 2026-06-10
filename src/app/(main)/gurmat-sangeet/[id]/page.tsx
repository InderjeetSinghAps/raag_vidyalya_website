"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Music2, Clock, User, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppDispatch } from "@/store/hooks"
import { playTrack, showMiniPlayer } from "@/store/playerSlice"
import { raags } from "@/data"

export default function RaagDetailPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const raag = raags.find((r) => r.id === params.id)

  if (!raag) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Music2 className="mb-4 size-12 text-[#64748B]" />
        <p className="text-lg text-[#94A3B8]">Raag not found</p>
        <Button
          variant="outline"
          className="mt-4 border-[#1E293B] text-[#94A3B8]"
          onClick={() => router.push("/gurmat-sangeet")}
        >
          Back to Gurmat Sangeet
        </Button>
      </div>
    )
  }

  const handlePlay = () => {
    dispatch(
      playTrack({
        id: raag.id,
        title: raag.name,
        artist: raag.artist,
        audioUrl: raag.audioUrl,
        image: raag.image,
        duration: raag.duration,
      })
    )
    dispatch(showMiniPlayer())
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <button
        onClick={() => router.push("/gurmat-sangeet")}
        className="mb-6 flex items-center gap-2 text-sm text-[#64748B] transition-colors hover:text-[#94A3B8]"
      >
        <ArrowLeft className="size-4" />
        Back to Gurmat Sangeet
      </button>

      <div className="mb-8 flex flex-col gap-6 sm:flex-row">
        <div className="flex h-48 w-full items-center justify-center rounded-xl bg-[#0B1220] sm:w-64">
          <Music2 className="size-16 text-cyan-400/30" />
        </div>
        <div className="flex flex-1 flex-col justify-center gap-3">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">{raag.name}</h1>
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="border border-cyan-500/20 bg-cyan-500/10 text-xs font-medium text-cyan-400">
              {raag.thaat}
            </Badge>
            <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
              <Clock className="size-3.5" />
              <span>{raag.time}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
              <User className="size-3.5" />
              <span>{raag.artist}</span>
            </div>
            <span className="text-xs text-[#64748B]">{raag.duration}</span>
          </div>
          <p className="text-sm text-[#64748B]">{raag.mood}</p>
        </div>
      </div>

      <div className="mb-6 space-y-2">
        <h2 className="text-base font-semibold text-white">Theory</h2>
        <p className="text-sm leading-relaxed text-[#94A3B8]">{raag.description}</p>
      </div>

      <div className="mb-8 space-y-4">
        <h2 className="text-base font-semibold text-white">Swar Structure</h2>
        <div className="space-y-3 rounded-xl border border-[#1E293B] bg-[#0B1220] p-5">
          <div>
            <span className="text-xs font-medium text-[#64748B]">Aroha</span>
            <p className="mt-1 font-mono text-sm text-cyan-400">{raag.aaroha}</p>
          </div>
          <div>
            <span className="text-xs font-medium text-[#64748B]">Avaroha</span>
            <p className="mt-1 font-mono text-sm text-[#94A3B8]">{raag.avaroha}</p>
          </div>
          <div>
            <span className="text-xs font-medium text-[#64748B]">Pakad</span>
            <p className="mt-1 font-mono text-sm text-[#94A3B8]">{raag.pakad}</p>
          </div>
        </div>
      </div>

      <Button
        variant="default"
        className="w-full bg-cyan-500 text-black hover:bg-cyan-400 sm:w-auto"
        onClick={handlePlay}
      >
        <Play className="size-4" />
        Play Recording
      </Button>
    </div>
  )
}
