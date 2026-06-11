"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Music2, Clock, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { getRaagTranslation } from "@/data/translations"
import { playTrack, showMiniPlayer } from "@/store/playerSlice"
import { raags } from "@/data"

const thaats = Array.from(new Set(raags.map((r) => r.thaat))).sort()

export default function GurmatSangeetPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const lang = useAppSelector((s) => s.language)
  const [search, setSearch] = useState("")
  const [thaat, setThaat] = useState("All")

  const filtered = raags.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.thaat.toLowerCase().includes(search.toLowerCase()) ||
      r.mood.toLowerCase().includes(search.toLowerCase())
    const matchThaat = thaat === "All" || r.thaat === thaat
    return matchSearch && matchThaat
  })

  const handleListen = (raag: (typeof raags)[number]) => {
    dispatch(
      playTrack({
        id: raag.id,
        title: raag.name,
        artist: raag.artist,
        audioUrl: raag.audioUrl,
        image: raag.image,
        duration: raag.duration,
      })
    )
    dispatch(showMiniPlayer())
  }

  const tr = (r: (typeof raags)[number]) => {
    const t = getRaagTranslation(r.id, lang)
    if (!t) return r
    return { ...r, name: t.name, thaat: t.thaat, time: t.time, mood: t.mood }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-balance text-2xl font-bold text-foreground">Gurmat Sangeet</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Explore the sacred raags of Sikh music tradition
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search raags by name, thaat, or mood..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-border bg-background pl-10 text-muted-foreground placeholder:text-muted-foreground/80"
          />
        </div>
      </div>

      <Tabs value={thaat} onValueChange={setThaat}>
        <TabsList className="flex w-full justify-center gap-3 bg-transparent p-0">
          {["All", ...thaats].map((t) => (
            <TabsTrigger
              key={t}
              value={t}
              className="rounded-full border border-border/50 px-4 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-200 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm hover:border-border hover:text-foreground"
            >
              {t}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="mt-8 mb-4">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((raag) => {
            const rt = tr(raag)
            return (
              <Card
                key={raag.id}
                className="flex cursor-pointer flex-col border-border bg-background transition-all hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.08)]"
                onClick={() => router.push(`/gurmat-sangeet/${raag.id}`)}
              >
                <div className="flex h-32 items-center justify-center rounded-t-xl bg-background">
                  <Music2 className="size-12 text-cyan-400/30" />
                </div>
                <CardContent className="flex flex-1 flex-col gap-3">
                  <h3 className="text-lg font-bold text-foreground">{rt.name}</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="border border-cyan-500/20 bg-cyan-500/10 text-[10px] font-medium text-cyan-400">
                      {rt.thaat}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground/80">
                      <Clock className="size-3" />
                      <span>{rt.time}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground/80">{rt.mood}</p>
                  <p className="font-mono text-xs text-cyan-400">{raag.aaroha}</p>
                  <div className="mt-auto pt-2">
                    <Button
                      variant="outline"
                      className="w-full border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 active:scale-[0.96]"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleListen(raag)
                      }}
                    >
                      Listen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Music2 className="mb-4 size-12 text-muted-foreground/80" />
            <p className="text-lg text-muted-foreground">No raags found</p>
            <p className="mt-1 text-sm text-muted-foreground/80">Try a different search or filter</p>
          </div>
        )}
      </div>
    </div>
  )
}
