"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Image, Play, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppDispatch } from "@/store/hooks"
import { playTrack, showMiniPlayer } from "@/store/playerSlice"
import { gurbaniItems } from "@/data"

const categories = ["All", "Shabad", "Asa Di Var", "Rehras", "Kirtan Sohila"] as const

const categoryMap: Record<string, string> = {
  g1: "Shabad",
  g2: "Rehras",
  g3: "Kirtan Sohila",
  g4: "Shabad",
  g5: "Shabad",
  g6: "Asa Di Var",
  g7: "Shabad",
}

export default function GurbaniPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")

  const filtered = gurbaniItems.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.gurmukhi.toLowerCase().includes(search.toLowerCase()) ||
      item.raag.toLowerCase().includes(search.toLowerCase()) ||
      item.artist.toLowerCase().includes(search.toLowerCase())
    const matchCategory = category === "All" || categoryMap[item.id] === category
    return matchSearch && matchCategory
  })

  const handlePlay = (item: (typeof gurbaniItems)[number]) => {
    dispatch(
      playTrack({
        id: item.id,
        title: item.title,
        artist: item.artist,
        audioUrl: item.audioUrl,
        image: item.image,
        duration: item.duration,
      })
    )
    dispatch(showMiniPlayer())
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-balance text-2xl font-bold text-white">Gurbani Daily Path</h1>
          <p className="mt-1 text-sm text-muted-foreground">Daily hymns and scriptures</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title, gurmukhi, raag, or artist..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-[#1E293B] bg-[#0B1220] pl-10 text-[#94A3B8] placeholder:text-[#64748B]"
          />
        </div>
      </div>

      <Tabs value={category} onValueChange={setCategory}>
<TabsList className="bg-[#0B1220]/80 w-full justify-center rounded-none p-1">
      {categories.map((cat, i) => (
        <>
          {i > 0 && <span key={`sep-${i}`} className="select-none px-1 text-[#1E293B] text-xs">|</span>}
          <TabsTrigger className="rounded-none px-3 text-xs font-medium text-[#64748B] transition-all duration-200 data-active:text-primary data-active:font-semibold hover:text-[#94A3B8]" key={cat} value={cat}>
            {cat}
          </TabsTrigger>
        </>
      ))}
    </TabsList>
      </Tabs>

      <div className="mt-4">
        <div className="divide-y divide-[#1E293B] rounded-xl border border-[#1E293B] bg-[#0B1220]">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="flex cursor-pointer items-center gap-4 px-5 py-4 transition-colors hover:bg-white/[0.02]"
              onClick={() => router.push(`/gurbani/${item.id}`)}
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#000000]">
                <Image className="size-5 text-[#64748B]" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                <p className="truncate text-xs text-[#64748B]">{item.gurmukhi}</p>
                <div className="mt-1 flex items-center gap-3">
                  <Badge className="border border-cyan-500/20 bg-cyan-500/10 text-[10px] font-medium text-cyan-400">
                    {item.raag}
                  </Badge>
                  <span className="text-[10px] text-[#64748B]">{item.artist}</span>
                  <span className="text-[10px] text-[#64748B]">{item.duration}</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="size-10 shrink-0 rounded-full border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 active:scale-[0.96]"
                onClick={(e) => {
                  e.stopPropagation()
                  handlePlay(item)
                }}
              >
                <Play className="size-4" />
              </Button>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Image className="mb-4 size-12 text-[#64748B]" />
            <p className="text-lg text-[#94A3B8]">No items found</p>
            <p className="mt-1 text-sm text-[#64748B]">Try a different search or category</p>
          </div>
        )}
      </div>
    </div>
  )
}
