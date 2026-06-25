"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { Play, Pause, SkipBack, SkipForward } from "lucide-react"

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00"
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

interface BandishPlayerProps {
  audioUrl: string | null
}

export function BandishPlayer({ audioUrl }: BandishPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onDurationChange = () => {
      if (isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration)
      }
    }
    const onEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }
    const onLoadedMetadata = () => {
      if (isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration)
      }
    }

    audio.addEventListener("timeupdate", onTimeUpdate)
    audio.addEventListener("durationchange", onDurationChange)
    audio.addEventListener("loadedmetadata", onLoadedMetadata)
    audio.addEventListener("ended", onEnded)

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate)
      audio.removeEventListener("durationchange", onDurationChange)
      audio.removeEventListener("loadedmetadata", onLoadedMetadata)
      audio.removeEventListener("ended", onEnded)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    audio.currentTime = 0
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)

    if (audioUrl) {
      audio.src = audioUrl
      audio.load()
    }
  }, [audioUrl])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !audioUrl) return
    if (audio.paused) {
      audio.play().catch(() => {})
      setIsPlaying(true)
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }, [audioUrl])

  const skip = useCallback((seconds: number) => {
    const audio = audioRef.current
    if (!audio || !isFinite(audio.duration)) return
    audio.currentTime = Math.max(0, Math.min(audio.currentTime + seconds, audio.duration))
  }, [])

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio || !isFinite(audio.duration) || audio.duration <= 0) return
    const time = (Number(e.target.value) / 100) * audio.duration
    audio.currentTime = time
    setCurrentTime(time)
  }, [])

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background">
      <audio ref={audioRef} preload="auto" className="hidden" />
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-center gap-4 px-4">
        <button
          onClick={() => skip(-10)}
          className="text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Skip back 10 seconds"
        >
          <SkipBack className="size-6" />
        </button>

        <button
          onClick={togglePlay}
          disabled={!audioUrl}
          className="flex size-10 items-center justify-center rounded-full bg-cyan-500 text-foreground transition-colors hover:bg-cyan-400 disabled:opacity-40"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="size-5" /> : <Play className="size-5" />}
        </button>

        <button
          onClick={() => skip(10)}
          className="text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Skip forward 10 seconds"
        >
          <SkipForward className="size-6" />
        </button>

        <div className="flex flex-1 items-center gap-3 max-w-md">
          <span className="w-10 text-right text-xs tabular-nums text-muted-foreground">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={progress}
            onChange={handleSeek}
            className="h-1 w-full cursor-pointer accent-cyan"
          />
          <span className="w-10 text-xs tabular-nums text-muted-foreground">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </footer>
  )
}
