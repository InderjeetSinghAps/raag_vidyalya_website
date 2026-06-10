"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Image, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { playTrack, showMiniPlayer } from "@/store/playerSlice"
import { setCurrentItem } from "@/store/gurbaniSlice"
import { gurbaniItems } from "@/data"

export default function GurbaniDetailPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const item = gurbaniItems.find((g) => g.id === params.id)
  const isPlaying = useAppSelector(
    (s) => s.player.isPlaying && s.player.currentTrack?.id === item?.id
  )

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Image className="mb-4 size-12 text-[#64748B]" />
        <p className="text-lg text-[#94A3B8]">Gurbani not found</p>
        <Button
          variant="outline"
          className="mt-4 border-[#1E293B] text-[#94A3B8]"
          onClick={() => router.push("/gurbani")}
        >
          Back to Gurbani
        </Button>
      </div>
    )
  }

  const handlePlayPause = () => {
    dispatch(setCurrentItem(item))
    if (!isPlaying) {
      dispatch(
        playTrack({
          id: item.id,
          title: item.title,
          artist: item.artist,
          audioUrl: item.audioUrl,
          image: item.image,
          duration: item.duration,
        })
      )
      dispatch(showMiniPlayer())
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-2xl flex-col px-4 py-8 sm:px-6 lg:px-8">
      <button
        onClick={() => router.push("/gurbani")}
        className="mb-6 flex items-center gap-2 text-sm text-[#64748B] transition-colors hover:text-[#94A3B8]"
      >
        <ArrowLeft className="size-4" />
        Back to Gurbani
      </button>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <div className="flex h-56 w-56 items-center justify-center rounded-2xl bg-[#0B1220] sm:h-64 sm:w-64">
          <Image className="size-20 text-cyan-400/30" />
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">{item.title}</h1>
          <p className="text-xl font-medium text-white">{item.gurmukhi}</p>
          <p className="text-sm text-[#94A3B8]">{item.transliteration}</p>
          <p className="mx-auto max-w-lg text-sm text-[#64748B]">{item.translation}</p>
        </div>
      </div>

      <div className="mt-auto pt-8">
        <Button
          variant="default"
          className="w-full bg-cyan-500 text-black hover:bg-cyan-400"
          onClick={handlePlayPause}
        >
          {isPlaying ? (
            <>
              <Pause className="size-5" />
              Pause
            </>
          ) : (
            <>
              <Play className="size-5" />
              Play
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
