"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Play, Clock, User as UserIcon, Calendar, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useGetVideosQuery } from "@/store/api"
import { YouTubeVideo } from "@/components/video/YouTubeVideo"

export default function VideoDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data, isLoading: loading, isError } = useGetVideosQuery({ page: 1, limit: 50 })
  const video = data?.videos.find((v) => v.id === params.id)

  if (loading) {
    return (
      <div className="mx-auto flex max-w-4xl items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
        <Loader2 className="size-8 animate-spin text-muted-foreground/60" />
      </div>
    )
  }

  if (isError || !video) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Play className="mb-4 size-12 text-muted-foreground/80" />
          <p className="text-lg text-muted-foreground">Video not found</p>
          <Button
            variant="outline"
            className="mt-4 border-border text-muted-foreground"
            onClick={() => router.push("/videos")}
          >
            Back to Videos
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <button
        onClick={() => router.push("/videos")}
        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground/80 transition-colors hover:text-muted-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Videos
      </button>

      {video.videoUrl ? (
        <YouTubeVideo url={video.videoUrl} poster={video.thumbnail} />
      ) : null}

      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{video.title}</h1>

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground/70">
          {video.duration && (
            <Badge
              variant="secondary"
              className="border-none bg-primary/10 text-primary"
            >
              <Clock className="mr-1 size-3" />
              {video.duration}
            </Badge>
          )}
          {video.instructor && (
            <Badge
              variant="secondary"
              className="border-none bg-muted/50 text-muted-foreground"
            >
              <UserIcon className="mr-1 size-3" />
              {video.instructor}
            </Badge>
          )}
          <Badge
            variant="secondary"
            className="border-none bg-muted/50 text-muted-foreground"
          >
            <Calendar className="mr-1 size-3" />
            {new Date(video.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Badge>
        </div>

        <div className="h-px bg-border" />

        <p className="leading-relaxed text-muted-foreground">{video.description}</p>

        <div className="flex gap-3 pt-4">
          <Button
            variant="default"
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => router.push("/videos")}
          >
            Browse More Tutorials
          </Button>
        </div>
      </div>
    </div>
  )
}
