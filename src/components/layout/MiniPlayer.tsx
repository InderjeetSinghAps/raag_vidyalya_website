"use client"

import { useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import { Play, Pause, X } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import {
  pauseTrack, resumeTrack, stopTrack,
  setCurrentTime, setDuration, setProgress,
} from "@/store/playerSlice"

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00"
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function MiniPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { currentTrack, isPlaying, currentTime, duration, volume } = useAppSelector(
    (state) => state.player
  )
  const dispatch = useAppDispatch()

  // Sync audio source when track changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return

    if (audio.src !== currentTrack.audioUrl) {
      audio.src = currentTrack.audioUrl
      audio.load()
      audio.play().catch(() => {})
    }
  }, [currentTrack])

  // Sync play/pause state
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return

    if (isPlaying) {
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }, [isPlaying, currentTrack])

  // Sync volume
  useEffect(() => {
    const audio = audioRef.current
    if (audio) audio.volume = volume
  }, [volume])

 // Audio event listeners
 useEffect(() => {
   const audio = audioRef.current
   if (!audio) return

   // Helper to log duration-related data and update Redux when valid
    const updateDuration = () => {
      const dur = audio.duration
      if (dur === Infinity) {
        if (audio.seekable.length > 0) {
          const seekableEnd = audio.seekable.end(audio.seekable.length - 1)
          if (Number.isFinite(seekableEnd) && seekableEnd > 0) {
            dispatch(setDuration(seekableEnd))
            return
          }
        }
        if (audio.buffered.length > 0) {
          const bufferedEnd = audio.buffered.end(audio.buffered.length - 1)
          if (Number.isFinite(bufferedEnd) && bufferedEnd > 0) {
            dispatch(setDuration(bufferedEnd))
          }
        }
        return
      }
      if (Number.isFinite(dur) && dur > 0) {
        dispatch(setDuration(dur))
      }
    }

    const onTimeUpdate = () => {
      dispatch(setCurrentTime(audio.currentTime))
      const dur = audio.duration
      if (Number.isFinite(dur) && dur > 0) {
        dispatch(setDuration(dur))
        dispatch(setProgress((audio.currentTime / dur) * 100))
      } else if (audio.buffered.length > 0) {
        const bufEnd = audio.buffered.end(audio.buffered.length - 1)
        if (Number.isFinite(bufEnd) && bufEnd > 0) {
          dispatch(setDuration(bufEnd))
          dispatch(setProgress((audio.currentTime / bufEnd) * 100))
        }
      }
    }

   const onEnded = () => {
     dispatch(stopTrack())
   }

   const onError = () => {
     console.error("[MiniPlayer] audio error:", audio.error?.message || "unknown error")
   }

   audio.addEventListener("timeupdate", onTimeUpdate)
   audio.addEventListener("loadedmetadata", updateDuration)
   audio.addEventListener("durationchange", updateDuration)
   audio.addEventListener("canplay", updateDuration)
   audio.addEventListener("ended", onEnded)
   audio.addEventListener("error", onError)

   return () => {
     audio.removeEventListener("timeupdate", onTimeUpdate)
     audio.removeEventListener("loadedmetadata", updateDuration)
     audio.removeEventListener("durationchange", updateDuration)
     audio.removeEventListener("canplay", updateDuration)
     audio.removeEventListener("ended", onEnded)
     audio.removeEventListener("error", onError)
   }
 }, [dispatch])

  // Pause + reset audio when track is cleared
  useEffect(() => {
    const audio = audioRef.current
    if (!currentTrack && audio) {
      audio.pause()
      audio.removeAttribute("src")
      audio.load()
    }
  }, [currentTrack])

  const handleSeek = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const audio = audioRef.current
      if (!audio) return
      const dur = audio.duration
      if (!Number.isFinite(dur) || dur <= 0) return
      const time = (Number(e.target.value) / 100) * dur
      audio.currentTime = time
      dispatch(setCurrentTime(time))
    },
    [dispatch]
  )

  if (!currentTrack) return null

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t border-border z-30 flex items-center px-4 gap-3">
      <audio ref={audioRef} preload="auto" className="hidden" />

      {currentTrack.image ? (
        <Image
          src={currentTrack.image}
          alt={currentTrack.title}
          width={40}
          height={40}
          className="w-10 h-10 rounded object-cover shrink-0"
          unoptimized
        />
      ) : (
        <div className="flex w-10 h-10 shrink-0 items-center justify-center rounded bg-muted">
          <Play className="size-4 text-muted-foreground" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground truncate">{currentTrack.title}</p>
        <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
      </div>

      {/* Seek bar */}
      <div className="hidden sm:flex items-center gap-2 min-w-[200px]">
        <span className="text-xs text-muted-foreground w-10 text-right tabular-nums">
          {formatTime(currentTime)}
        </span>
        <input
          type="range"
          min={0}
          max={100}
          step={0.1}
          value={progress}
          onChange={handleSeek}
          className="w-full h-1 accent-cyan cursor-pointer"
        />
        <span className="text-xs text-muted-foreground w-10 tabular-nums">
          {formatTime(duration)}
        </span>
      </div>

      <button
        onClick={() => dispatch(isPlaying ? pauseTrack() : resumeTrack())}
        className="text-foreground hover:text-cyan transition-colors shrink-0"
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>
      <button
        onClick={() => dispatch(stopTrack())}
        className="text-foreground hover:text-red-400 transition-colors shrink-0"
        aria-label="Stop playback"
      >
        <X size={18} />
      </button>

      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted">
        <div
          className="h-full bg-cyan transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
