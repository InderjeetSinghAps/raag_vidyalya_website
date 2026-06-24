"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Play, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGetPreviousResultsQuery } from "@/store/api"
import { getYouTubeVideoId } from "@/lib/video"

export default function PreviousResultsPage() {
  const router = useRouter()
  const { data, isLoading } = useGetPreviousResultsQuery()
  const results = data?.previousResults ?? []

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-20">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-20 text-center">
        <Trophy className="mb-4 size-12 text-muted-foreground/80" />
        <p className="text-lg text-muted-foreground">No results yet</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-3">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="h-8 w-8 p-0 text-[#6b7280] hover:text-[#151515]"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Previous Results</h1>
          <p className="text-sm text-muted-foreground">All contest performances</p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((r) => {
          const videoId = getYouTubeVideoId(r.videoUrl)
          return (
            <div
              key={r._id}
              onClick={() => window.open(r.videoUrl, '_blank')}
              className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-[0.97]"
            >
              <div className="relative flex h-44 items-center justify-center overflow-hidden rounded-t-xl bg-gradient-to-br from-primary/20 to-primary/5">
                {videoId ? (
                  <img
                    src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                    alt={r.title}
                    className="absolute inset-0 size-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                    }}
                  />
                ) : null}
                <div className="relative flex size-14 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-colors">
                  <Play className="size-6 text-white/90" />
                </div>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-semibold text-foreground line-clamp-2">{r.title}</h3>
                {r.description && (
                  <p className="mt-1.5 flex-1 text-xs text-muted-foreground line-clamp-2">{r.description}</p>
                )}
                <div className="mt-auto flex items-center gap-1.5 pt-3 text-[11px] text-muted-foreground/70">
                  <Calendar className="size-3" />
                  {new Date(r.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
