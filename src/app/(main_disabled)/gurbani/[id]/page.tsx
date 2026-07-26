"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, BookOpen, Play, Pause, ExternalLink, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { useGetGurbaniCollectionsQuery } from "@/store/api"
import { playTrack, showMiniPlayer } from "@/store/playerSlice"
import { getGoogleDriveAudioUrl } from "@/lib/video"

export default function GurbaniDetailPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { data: collections, isLoading } = useGetGurbaniCollectionsQuery()

  const allBaanis = (collections ?? []).flatMap((c) => c.baanis)
  const baani = allBaanis.find((b) => b._id === params.id)

  const isPlaying = useAppSelector(
    (s) => s.player.isPlaying && s.player.currentTrack?.id === baani?._id
  )

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground/60" />
      </div>
    )
  }

  if (!baani) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <BookOpen className="mb-4 size-12 text-muted-foreground/80" />
        <p className="text-lg text-muted-foreground">Gurbani not found</p>
        <Button
          variant="outline"
          className="mt-4 border-border text-muted-foreground"
          onClick={() => router.push("/gurbani")}
        >
          Back to Gurbani
        </Button>
      </div>
    )
  }

  const handlePlayPause = () => {
    if (!isPlaying) {
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
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-2xl flex-col px-4 py-8 sm:px-6 lg:px-8">
      <button
        onClick={() => router.push("/gurbani")}
        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground/80 transition-colors hover:text-muted-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Gurbani
      </button>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <div className="flex h-56 w-56 items-center justify-center rounded-2xl bg-background sm:h-64 sm:w-64">
          <BookOpen className="size-20 text-cyan-400/30" />
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{baani.title}</h1>
          {baani.gurmukhi && (
            <p className="text-xl font-medium text-foreground/90">{baani.gurmukhi}</p>
          )}
          {baani.transliteration && (
            <p className="text-sm text-muted-foreground">{baani.transliteration}</p>
          )}
          {baani.translation && (
            <p className="mx-auto max-w-lg text-sm text-muted-foreground/80">{baani.translation}</p>
          )}
        </div>
      </div>

      <div className="mt-auto flex flex-col items-center gap-3 pt-8">
        <Button
          variant="default"
          className="w-full bg-cyan-500 text-foreground hover:bg-cyan-400"
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

        {baani.pdfUrl && (
          <a
            href={baani.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-cyan-400 transition-colors hover:text-cyan-300"
          >
            <ExternalLink className="size-4" />
            View PDF
          </a>
        )}
      </div>
    </div>
  )
}
