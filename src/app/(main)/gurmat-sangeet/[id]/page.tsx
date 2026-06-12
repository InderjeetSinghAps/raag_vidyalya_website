"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Music2, Clock, Play, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppDispatch } from "@/store/hooks"
import { playTrack, showMiniPlayer } from "@/store/playerSlice"
import { useGetRaagsQuery } from "@/store/api"

export default function RaagDetailPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { data, isLoading } = useGetRaagsQuery()
  const raag = (data?.raags ?? []).find((r) => r._id === params.id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-cyan-400" />
      </div>
    )
  }

  if (!raag) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Music2 className="mb-4 size-12 text-muted-foreground/80" />
        <p className="text-lg text-muted-foreground">Raag not found</p>
        <Button
          variant="outline"
          className="mt-4 border-border text-muted-foreground"
          onClick={() => router.push("/gurmat-sangeet")}
        >
          Back to Gurmat Sangeet
        </Button>
      </div>
    )
  }

  const handlePlay = () => {
    dispatch(
      playTrack({
        id: raag._id,
        title: raag.name,
        artist: "",
        audioUrl: raag.audioUrl || "",
        image: "",
        duration: "",
      })
    )
    dispatch(showMiniPlayer())
  }

  const handlePlayBandish = (audioUrl: string | null, name: string) => {
    if (!audioUrl) return
    dispatch(
      playTrack({
        id: raag._id,
        title: name,
        artist: "",
        audioUrl,
        image: "",
        duration: "",
      })
    )
    dispatch(showMiniPlayer())
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <button
        onClick={() => router.push("/gurmat-sangeet")}
        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground/80 transition-colors hover:text-muted-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Gurmat Sangeet
      </button>

      <div className="mb-8 flex flex-col gap-6 sm:flex-row">
        <div className="flex h-48 w-full items-center justify-center rounded-xl bg-background sm:w-64">
          <Music2 className="size-16 text-cyan-400/30" />
        </div>
        <div className="flex flex-1 flex-col justify-center gap-3">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{raag.name}</h1>
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="border border-cyan-500/20 bg-cyan-500/10 text-xs font-medium text-cyan-400">
              {raag.thaat}
            </Badge>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80">
              <Clock className="size-3.5" />
              <span>{raag.time}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground/80">{raag.jaati} — {raag.sur}</p>
        </div>
      </div>

      <div className="mb-8 space-y-4">
        <h2 className="text-base font-semibold text-foreground">Swar Structure</h2>
        <div className="space-y-3 rounded-xl border border-border bg-background p-5">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-xs font-medium text-muted-foreground/80">Thaat</span>
              <p className="mt-1 text-muted-foreground">{raag.thaat}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-muted-foreground/80">Jaati</span>
              <p className="mt-1 text-muted-foreground">{raag.jaati}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-muted-foreground/80">Vaadi</span>
              <p className="mt-1 text-muted-foreground">{raag.vaadi}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-muted-foreground/80">Samvadi</span>
              <p className="mt-1 text-muted-foreground">{raag.samvadi}</p>
            </div>
            <div className="col-span-2">
              <span className="text-xs font-medium text-muted-foreground/80">Sur</span>
              <p className="mt-1 font-mono text-cyan-400">{raag.sur}</p>
            </div>
            {raag.wargitSur && (
              <div className="col-span-2">
                <span className="text-xs font-medium text-muted-foreground/80">Wargit Sur</span>
                <p className="mt-1 font-mono text-muted-foreground">{raag.wargitSur}</p>
              </div>
            )}
          </div>
          <div>
            <span className="text-xs font-medium text-muted-foreground/80">Aroha</span>
            <p className="mt-1 font-mono text-sm text-cyan-400">{raag.aroh}</p>
          </div>
          <div>
            <span className="text-xs font-medium text-muted-foreground/80">Avroha</span>
            <p className="mt-1 font-mono text-sm text-muted-foreground">{raag.avroh}</p>
          </div>
        </div>
      </div>

      {raag.listOfBandish && raag.listOfBandish.length > 0 && (
        <div className="mb-8 space-y-4">
          <h2 className="text-base font-semibold text-foreground">Bandishes</h2>
          <div className="space-y-3">
            {raag.listOfBandish.map((bandish) => (
              <div
                key={bandish.sId}
                className="flex items-center justify-between rounded-xl border border-border bg-background p-4"
              >
                <div className="flex items-center gap-3">
                  <Music2 className="size-5 text-cyan-400/50" />
                  <span className="text-sm text-muted-foreground">{bandish.bandishName}</span>
                </div>
                <div className="flex items-center gap-2">
                  {bandish.pdfUrl && (
                    <a
                      href={bandish.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <FileText className="size-3.5" />
                      PDF
                    </a>
                  )}
                  {bandish.audioUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 text-cyan-400 hover:bg-cyan-500/10"
                      onClick={() => handlePlayBandish(bandish.audioUrl, bandish.bandishName)}
                    >
                      <Play className="size-3.5" />
                      Play
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {raag.audioUrl && (
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            variant="default"
            className="bg-cyan-500 text-foreground hover:bg-cyan-400"
            onClick={handlePlay}
          >
            <Play className="size-4" />
            Play Raag Recording
          </Button>
        </div>
      )}
    </div>
  )
}
