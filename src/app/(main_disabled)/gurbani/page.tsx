"use client"

import { useRouter } from "next/navigation"
import { BookOpen, Play, Loader2, ExternalLink, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppDispatch } from "@/store/hooks"
import { useGetGurbaniCollectionsQuery } from "@/store/api"
import { playTrack, showMiniPlayer } from "@/store/playerSlice"
import { getGoogleDriveAudioUrl } from "@/lib/video"
import type { GurbaniBaani } from "@/types"

export default function GurbaniPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { data: collections, isLoading, isError } = useGetGurbaniCollectionsQuery()

  const handlePlay = (baani: GurbaniBaani, e: React.MouseEvent) => {
    e.stopPropagation()
    const audioUrl = getGoogleDriveAudioUrl(baani.audioUrl) || baani.audioUrl
    dispatch(
      playTrack({
        id: baani._id,
        title: baani.title,
        artist: "",
        audioUrl,
        image: "",
        duration: "",
      })
    )
    dispatch(showMiniPlayer())
  }

  const handleViewDetail = (baaniId: string) => {
    router.push(`/gurbani/${baaniId}`)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground/60" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <AlertCircle className="size-12 text-muted-foreground/60" />
        <p className="text-lg text-muted-foreground">Could not load Gurbani</p>
        <p className="text-sm text-muted-foreground/60">Please try again later</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-balance text-2xl font-bold text-foreground">Gurbani</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sacred scriptures and hymns</p>
      </div>

      <div className="space-y-4">
        {(collections ?? []).map((collection) => (
          <div
            key={collection._id}
            className="rounded-xl border border-border bg-background overflow-hidden"
          >
            <div className="flex items-center gap-3 px-5 py-4">
              <BookOpen className="size-5 text-cyan-400 shrink-0" />
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold text-foreground">{collection.title}</h2>
                {collection.titleGurmukhi && (
                  <p className="text-sm text-muted-foreground/80">{collection.titleGurmukhi}</p>
                )}
              </div>
              <p className="text-xs text-muted-foreground/60">{collection.baanis.length} baanis</p>
            </div>

            <div className="divide-y divide-border border-t border-border">
              {collection.baanis.map((baani) => (
                <div
                  key={baani._id}
                  className="flex cursor-pointer items-center gap-4 px-5 py-3 pl-12 transition-colors hover:bg-white/[0.02]"
                  onClick={() => handleViewDetail(baani._id)}
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium text-foreground">{baani.title}</h3>
                    {baani.gurmukhi && (
                      <p className="truncate text-xs text-muted-foreground/80">{baani.gurmukhi}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {baani.pdfUrl && (
                      <a
                        href={baani.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex size-8 items-center justify-center rounded-full text-muted-foreground/60 transition-colors hover:text-cyan-400"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="size-3.5" />
                      </a>
                    )}
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-8 shrink-0 rounded-full border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 active:scale-[0.96]"
                      onClick={(e) => handlePlay(baani, e)}
                    >
                      <Play className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
