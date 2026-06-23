'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Play, Pause, Square, RefreshCw } from 'lucide-react'
import { LIVE_AMRITSAR_KIRTAN_URL } from '@/lib/constants'

export default function LivePage() {
  const router = useRouter()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)
  const [url, setUrl] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    return () => {
      audioRef.current?.pause()
    }
  }, [])

  useEffect(() => {
    const u = (() => {
      if (LIVE_AMRITSAR_KIRTAN_URL) return LIVE_AMRITSAR_KIRTAN_URL
      try {
        const cached = localStorage.getItem('app_data_constants')
        if (cached) {
          const data = JSON.parse(cached)
          if (typeof data.live_amritsar_kirtan_url === 'string' && data.live_amritsar_kirtan_url) {
            return data.live_amritsar_kirtan_url
          }
        }
      } catch {}
      return null
    })()

    if (u) {
      setUrl(u)
      setDone(true)
      return
    }

    const timeout = setTimeout(() => setDone(true), 8000)
    const interval = setInterval(() => {
      if (LIVE_AMRITSAR_KIRTAN_URL) {
        setUrl(LIVE_AMRITSAR_KIRTAN_URL)
        setDone(true)
        clearInterval(interval)
        clearTimeout(timeout)
      }
    }, 500)
    return () => { clearInterval(interval); clearTimeout(timeout) }
  }, [])

  const handlePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      setIsBuffering(true)
      audio.play().catch(() => setIsBuffering(false))
    } else {
      audio.pause()
    }
  }, [])

  const handleStop = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    audio.currentTime = 0
    setIsPlaying(false)
    setIsBuffering(false)
  }, [])

  const handleRefresh = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    audio.currentTime = 0
    setIsBuffering(true)
    audio.load()
    audio.play().catch(() => setIsBuffering(false))
  }, [])

  return (
    <div className="relative min-h-0 overflow-y-auto bg-[#020202]">
      <button
        onClick={() => router.back()}
        className="fixed left-4 top-[88px] z-20 flex size-10 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.04] text-white/60 backdrop-blur-xl transition-all duration-200 hover:bg-white/[0.08] hover:text-white/80"
        aria-label="Go back"
      >
        <ArrowLeft className="size-5" />
      </button>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06)_0%,transparent_40%)]" />
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
        <div className="size-[600px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.08),transparent_50%)]" />
      </div>
      <div className="pointer-events-none fixed inset-0 flex select-none items-center justify-center">
        <span className="leading-none text-white/[0.03] text-[min(50vw,400px)]">ੴ</span>
      </div>

      <main className="relative z-10 mx-auto flex w-full max-w-[900px] flex-col items-center justify-center px-4" style={{ minHeight: 'calc(100vh - 80px)' }}>
        {!done ? (
          <div className="relative size-[80px]">
            <div className="absolute inset-0 rounded-full border-2 border-[rgba(212,175,55,0.15)]" />
            <div className="absolute inset-[2px] flex animate-pulse items-center justify-center rounded-full bg-[radial-gradient(circle,#171732,#090912)]">
              <span className="text-2xl text-white/20">ੴ</span>
            </div>
          </div>
        ) : !url ? (
          <>
            <Play className="size-12 text-white/20" />
            <h2 className="mt-4 text-xl font-semibold text-white/60">No Live Streams</h2>
            <p className="mt-2 text-sm text-white/40">There are no live kirtan streams available at the moment.</p>
          </>
        ) : (
          <>
            <p className="text-[11px] uppercase tracking-[0.2em] text-amber-200/50">Live Kirtan</p>
            <h1 className="mt-1 text-balance text-center text-xl font-semibold text-white">
              Darbar Sahib{' '}
              <span className="text-amber-200/40">&bull;</span>{' '}
              <span className="text-amber-200/70">Amritsar</span>
            </h1>
            <div className="mt-4 flex items-center gap-2">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-red-500" />
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-red-400">Live</span>
            </div>
            <div className="relative mt-6 size-[280px] md:size-[380px]">
              <div
                className="absolute inset-0 rounded-full border-2 border-[rgba(212,175,55,0.2)]"
                style={{ boxShadow: '0 0 60px rgba(212,175,55,.08), 0 0 120px rgba(212,175,55,.04)' }}
              />
              <div
                className="absolute inset-[3px] flex items-center justify-center rounded-full bg-[radial-gradient(circle,#171732,#090912)]"
                style={{ boxShadow: 'inset 0 0 40px rgba(212,175,55,.06)' }}
              >
                <span className="select-none text-7xl text-white/10 md:text-8xl">ੴ</span>
              </div>
              {isPlaying && (
                <svg className="absolute inset-0 size-full animate-[spin_4s_linear_infinite]" viewBox="0 0 380 380" fill="none">
                  <circle cx="190" cy="190" r="186" stroke="rgba(212,175,55,0.6)" strokeWidth="2" strokeDasharray="292 876" strokeLinecap="round" />
                </svg>
              )}
            </div>
            {isBuffering && (
              <div className="mt-5 flex items-center gap-3 rounded-full border border-white/[0.06] bg-white/[0.04] px-6 py-3 backdrop-blur-xl">
                <RefreshCw className="size-4 animate-spin text-amber-200/60" />
                <span className="text-sm text-amber-200/60">Buffering...</span>
              </div>
            )}
            <div className="mt-6 flex items-center gap-4 md:gap-6">
              <button
                onClick={handleStop}
                className="flex size-[70px] items-center justify-center rounded-full border border-[rgba(212,175,55,0.15)] bg-[rgba(212,175,55,0.06)] text-amber-200/60 transition-all duration-200 hover:bg-[rgba(212,175,55,0.12)] hover:text-amber-200/80 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] active:scale-95 md:size-[90px]"
              >
                <Square className="size-5 fill-current md:size-6" />
              </button>
              <button
                onClick={handlePlay}
                className="flex size-[100px] items-center justify-center rounded-full border border-[rgba(212,175,55,0.2)] bg-[rgba(212,175,55,0.1)] text-amber-200/80 transition-all duration-200 hover:bg-[rgba(212,175,55,0.18)] hover:text-amber-200 hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] active:scale-95 md:size-[120px]"
              >
                {isPlaying ? (
                  <Pause className="size-8 fill-current md:size-10" />
                ) : (
                  <Play className="ml-1 size-8 fill-current md:ml-1 md:size-10" />
                )}
              </button>
              <button
                onClick={handleRefresh}
                className="flex size-[70px] items-center justify-center rounded-full border border-[rgba(212,175,55,0.15)] bg-[rgba(212,175,55,0.06)] text-amber-200/60 transition-all duration-200 hover:bg-[rgba(212,175,55,0.12)] hover:text-amber-200/80 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] active:scale-95 md:size-[90px]"
              >
                <RefreshCw className="size-5 md:size-6" />
              </button>
            </div>
            <div className="mt-6 w-full max-w-sm rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-xl">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-200/80">Stream Info</h3>
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3 text-sm text-white/60">
                  <span className="shrink-0">{'\u{1F4CD}'}</span>
                  <span>Sachkhand Sri Harmandir Sahib, Amritsar</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/60">
                  <span className="shrink-0">{'\u{1F4E1}'}</span>
                  <span>SGPC Official Stream</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/60">
                  <span className="shrink-0">{'\u{1F552}'}</span>
                  <span>Broadcasting 24/7</span>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
      <audio
        ref={audioRef}
        src={url || undefined}
        preload="none"
        className="hidden"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onWaiting={() => setIsBuffering(true)}
        onCanPlay={() => setIsBuffering(false)}
      />
    </div>
  )
}
