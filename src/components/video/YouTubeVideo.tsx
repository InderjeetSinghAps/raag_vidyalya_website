"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { getYouTubeEmbedUrl, getYouTubeVideoId } from "@/lib/video"

interface YouTubeVideoProps {
  url: string
  poster?: string
}

export function YouTubeVideo({ url, poster }: YouTubeVideoProps) {
  const [streamUrl, setStreamUrl] = useState<string | null>(null)
  const [state, setState] = useState<"loading" | "ready" | "failed">("loading")

  const videoId = getYouTubeVideoId(url)
  const isYouTubeUrl = !!videoId

  useEffect(() => {
    if (!isYouTubeUrl) {
      setStreamUrl(url)
      setState("ready")
      return
    }

    let cancelled = false

    fetch(`https://yt2html5.com/?id=${videoId}`)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return

        const formats: any[] = json?.data?.formats || []
        const best = formats
          .filter((f) => f.hasVideo)
          .sort((a, b) => {
            const aScore =
              (parseInt(a.qualityLabel) || 0) + (a.hasAudio ? 100000 : 0)
            const bScore =
              (parseInt(b.qualityLabel) || 0) + (b.hasAudio ? 100000 : 0)
            return bScore - aScore
          })[0]

        if (best?.url) {
          setStreamUrl(best.url)
          setState("ready")
        } else {
          setState("failed")
        }
      })
      .catch(() => {
        if (!cancelled) setState("failed")
      })

    return () => {
      cancelled = true
    }
  }, [url, videoId, isYouTubeUrl])

  if (!isYouTubeUrl) {
    return (
      <div className="relative mb-6 overflow-hidden rounded-xl bg-black/20 aspect-video">
        <video
          src={url}
          controls
          className="size-full"
          poster={poster && poster !== "/placeholder.svg" ? poster : undefined}
        />
      </div>
    )
  }

  if (state === "failed") {
    const embedUrl = getYouTubeEmbedUrl(url)
    return (
      <div className="relative mb-6 overflow-hidden rounded-xl bg-black/20 aspect-video">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="size-full"
          />
        ) : (
          <div className="flex items-center justify-center size-full text-muted-foreground">
            Video unavailable
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative mb-6 overflow-hidden rounded-xl bg-black/20 aspect-video">
      <video
        src={streamUrl || undefined}
        controls
        className="size-full"
        poster={poster && poster !== "/placeholder.svg" ? poster : undefined}
      />
      {state === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
          <Loader2 className="size-8 animate-spin text-white/80" />
        </div>
      )}
    </div>
  )
}
