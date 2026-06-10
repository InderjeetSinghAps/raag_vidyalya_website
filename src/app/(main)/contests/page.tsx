"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trophy, Calendar, Users, ImageIcon, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppSelector } from "@/store/hooks"
import { contests } from "@/data"

const statusBadge: Record<string, string> = {
  active: "border-green-500/30 bg-green-500/10 text-green-400",
  upcoming: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  completed: "border-[#64748B]/30 bg-[#64748B]/10 text-[#64748B]",
}

const tabs = ["All", "Active", "Upcoming", "Completed"]

export default function ContestsPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [tab, setTab] = useState("All")

  const filtered = contests.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.prize.toLowerCase().includes(search.toLowerCase())
    const matchStatus = tab === "All" || c.status.toLowerCase() === tab.toLowerCase()
    return matchSearch && matchStatus
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-balance text-2xl font-bold text-white">Contests</h1>
          <p className="mt-1 text-sm text-muted-foreground">Participate in Gurmat Sangeet competitions</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search contests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-[#1E293B] bg-[#0B1220] pl-10 text-[#94A3B8] placeholder:text-[#64748B]"
          />
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
<TabsList className="bg-[#0B1220]/80 w-full justify-center rounded-none p-1">
      {tabs.map((t, i) => (
        <>
          {i > 0 && <span key={`sep-${i}`} className="select-none px-1 text-[#1E293B] text-xs">|</span>}
          <TabsTrigger className="rounded-none px-3 text-xs font-medium text-[#64748B] transition-all duration-200 data-active:text-primary data-active:font-semibold hover:text-[#94A3B8]" key={t} value={t}>
            {t}
          </TabsTrigger>
        </>
      ))}
    </TabsList>
      </Tabs>

      <div className="mt-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((contest) => (
            <Card
              key={contest.id}
              size="sm"
              className="border-[#1E293B] bg-[#0B1220] transition-all hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.08)]"
            >
              <div className="flex h-32 items-center justify-center rounded-t-xl bg-[#0B1220]">
                <ImageIcon className="size-10 text-[#64748B]" />
              </div>
              <CardContent className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-white">{contest.title}</h3>
                  <Badge className={`border text-[10px] uppercase tracking-wider ${statusBadge[contest.status] || ""}`}>
                    {contest.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5 text-sm font-medium text-cyan-400">
                  <Trophy className="size-3.5" />
                  {contest.prize}
                </div>
                <div className="flex items-center gap-3 text-xs text-[#64748B]">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {contest.deadline}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="size-3" />
                    {contest.participants}
                  </span>
                </div>
                {(contest.status === "active" || contest.status === "upcoming") && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 active:scale-[0.96]"
                    onClick={() => router.push(`/contests/${contest.id}`)}
                  >
                    Enter Now
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Trophy className="mb-4 size-12 text-[#64748B]" />
            <p className="text-lg text-[#94A3B8]">No contests found</p>
            <p className="mt-1 text-sm text-[#64748B]">Try a different search or filter</p>
          </div>
        )}
      </div>
    </div>
  )
}
