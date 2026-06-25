"use client"

import { getYouTubeEmbedUrl, getYouTubeVideoId } from "@/lib/video"

interface YouTubeVideoProps {
  url: string
  poster?: string
}

export function YouTubeVideo({ url, poster }: YouTubeVideoProps) {
  const videoId = getYouTubeVideoId(url)
  const isYouTubeUrl = !!videoId

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
