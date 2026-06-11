"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Image, Play, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { playTrack, showMiniPlayer } from "@/store/playerSlice"
import { gurbaniItems } from "@/data"
import { getGurbaniTranslation } from "@/data/translations"

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
  const lang = useAppSelector((s) => s.language)
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
          <h1 className="text-balance text-2xl font-bold text-foreground">Gurbani Daily Path</h1>
          <p className="mt-1 text-sm text-muted-foreground">Daily hymns and scriptures</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title, gurmukhi, raag, or artist..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-border bg-background pl-10 text-muted-foreground placeholder:text-muted-foreground/80"
          />
        </div>
      </div>

      <Tabs value={category} onValueChange={setCategory}>
        <TabsList className="flex w-full justify-center gap-3 bg-transparent p-0">
          {categories.map((cat) => (
            <TabsTrigger
              key={cat}
              value={cat}
              className="rounded-full border border-border/50 px-4 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-200 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm hover:border-border hover:text-foreground"
            >
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="mt-8 mb-4">
        <div className="divide-y divide-border rounded-xl border border-border bg-background">
          {filtered.map((item) => {
            const tr = getGurbaniTranslation(item.id, lang)
            const title = tr?.title ?? item.title
            return (
            <div
              key={item.id}
              className="flex cursor-pointer items-center gap-4 px-5 py-4 transition-colors hover:bg-white/[0.02]"
              onClick={() => router.push(`/gurbani/${item.id}`)}
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-background">
                <Image className="size-5 text-muted-foreground/80" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                <p className="truncate text-xs text-muted-foreground/80">{item.gurmukhi}</p>
                <div className="mt-1 flex items-center gap-3">
                  <Badge className="border border-cyan-500/20 bg-cyan-500/10 text-[10px] font-medium text-cyan-400">
                    {item.raag}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground/80">{item.artist}</span>
                  <span className="text-[10px] text-muted-foreground/80">{item.duration}</span>
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
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Image className="mb-4 size-12 text-muted-foreground/80" />
            <p className="text-lg text-muted-foreground">No items found</p>
            <p className="mt-1 text-sm text-muted-foreground/80">Try a different search or category</p>
          </div>
        )}
      </div>
    </div>
  )
}
