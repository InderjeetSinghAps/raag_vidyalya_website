"use client"

import { Fragment, useState } from "react"
import { useRouter } from "next/navigation"
import { Music2, Clock, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppDispatch } from "@/store/hooks"
import { playTrack, showMiniPlayer } from "@/store/playerSlice"
import { raags } from "@/data"

const thaats = Array.from(new Set(raags.map((r) => r.thaat))).sort()

export default function GurmatSangeetPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-balance text-2xl font-bold text-white">Gurmat Sangeet</h1>
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
            className="border-[#1E293B] bg-[#0B1220] pl-10 text-[#94A3B8] placeholder:text-[#64748B]"
          />
        </div>
      </div>

      <Tabs value={thaat} onValueChange={setThaat}>
<TabsList className="bg-[#0B1220]/80 w-full justify-center rounded-none p-1">
      <TabsTrigger className="rounded-none px-3 text-xs font-medium text-[#64748B] transition-all duration-200 data-active:text-primary data-active:font-semibold hover:text-[#94A3B8]" value="All">All</TabsTrigger>
      {thaats.map((t, i) => (
        <Fragment key={t}>
          <span key={`sep-${i}`} className="select-none px-1 text-[#1E293B] text-xs">|</span>
          <TabsTrigger className="rounded-none px-3 text-xs font-medium text-[#64748B] transition-all duration-200 data-active:text-primary data-active:font-semibold hover:text-[#94A3B8]" value={t}>{t}</TabsTrigger>
        </Fragment>
      ))}
    </TabsList>
      </Tabs>

      <div className="mt-4">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((raag) => (
            <Card
              key={raag.id}
              className="flex cursor-pointer flex-col border-[#1E293B] bg-[#0B1220] transition-all hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.08)]"
              onClick={() => router.push(`/gurmat-sangeet/${raag.id}`)}
            >
              <div className="flex h-32 items-center justify-center rounded-t-xl bg-[#0B1220]">
                <Music2 className="size-12 text-cyan-400/30" />
              </div>
              <CardContent className="flex flex-1 flex-col gap-3">
                <h3 className="text-lg font-bold text-white">{raag.name}</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="border border-cyan-500/20 bg-cyan-500/10 text-[10px] font-medium text-cyan-400">
                    {raag.thaat}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-[#64748B]">
                    <Clock className="size-3" />
                    <span>{raag.time}</span>
                  </div>
                </div>
                <p className="text-xs text-[#64748B]">{raag.mood}</p>
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
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Music2 className="mb-4 size-12 text-[#64748B]" />
            <p className="text-lg text-[#94A3B8]">No raags found</p>
            <p className="mt-1 text-sm text-[#64748B]">Try a different search or filter</p>
          </div>
        )}
      </div>
    </div>
  )
}
