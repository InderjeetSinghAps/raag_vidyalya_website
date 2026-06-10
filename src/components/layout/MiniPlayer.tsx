"use client"

import Image from "next/image"
import { Play, Pause } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { pauseTrack, resumeTrack } from "@/store/playerSlice"

export function MiniPlayer() {
  const { currentTrack, isPlaying, progress } = useAppSelector((state) => state.player)
  const dispatch = useAppDispatch()

  if (!currentTrack) return null

  return (
    <div className="fixed bottom-16 left-0 right-0 h-16 bg-[#0B1220] border-t border-[#1E293B] z-30 flex items-center px-4 gap-3">
      <Image
        src={currentTrack.image}
        alt={currentTrack.title}
        width={40}
        height={40}
        className="w-10 h-10 rounded object-cover shrink-0"
        unoptimized
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white truncate">{currentTrack.title}</p>
        <p className="text-xs text-[#94A3B8] truncate">{currentTrack.artist}</p>
      </div>
      <button
        onClick={() => dispatch(isPlaying ? pauseTrack() : resumeTrack())}
        className="text-white hover:text-[#06B6D4] transition-colors shrink-0"
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1E293B]">
        <div
          className="h-full bg-[#06B6D4] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
