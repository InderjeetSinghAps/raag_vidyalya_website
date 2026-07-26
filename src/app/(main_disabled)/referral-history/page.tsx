"use client"

import { useState } from "react"
import { Gift, ArrowLeft, Users, CheckCircle, Clock, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useGetReferralHistoryQuery } from "@/store/api"
import type { ReferralHistoryResponse, ReferralHistoryStats } from "@/types"

const TOTAL_UNLOCKABLE = 29

interface ReferralItem {
  email?: string
  userName?: string
  status: "pending" | "successful" | "failed"
  createdAt: string
}

const statCards = [
  { key: "total" as const, label: "Total", icon: Users, border: "border-blue-500/20", bg: "bg-blue-500/10", text: "text-blue-400" },
  { key: "successful" as const, label: "Successful", icon: CheckCircle, border: "border-green-500/20", bg: "bg-green-500/10", text: "text-green-400" },
  { key: "pending" as const, label: "Pending", icon: Clock, border: "border-yellow-500/20", bg: "bg-yellow-500/10", text: "text-yellow-400" },
  { key: "failed" as const, label: "Failed", icon: XCircle, border: "border-red-500/20", bg: "bg-red-500/10", text: "text-red-400" },
]

const statusConfig = {
  pending: { label: "Pending", classes: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400" },
  successful: { label: "Successful", classes: "border-green-500/30 bg-green-500/10 text-green-400" },
  failed: { label: "Failed", classes: "border-red-500/30 bg-red-500/10 text-red-400" },
}

export default function ReferralHistoryPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useGetReferralHistoryQuery({ page, limit: 20 })
  const stats = data?.stats as ReferralHistoryStats | undefined
  const referrals = (data?.referrals ?? []) as ReferralItem[]
  const totalPages = data?.totalPages ?? 1

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/profile"
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground/80 transition-colors hover:text-muted-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Profile
      </Link>

      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
          <Gift className="size-5 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">My Referrals</h1>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-8 animate-spin text-muted-foreground/60" />
        </div>
      ) : (
        <>
          {stats && (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {statCards.map((card) => {
                const Icon = card.icon
                return (
                  <div key={card.key} className={`rounded-xl border ${card.border} ${card.bg} p-4`}>
                    <div className="flex items-center gap-2">
                      <Icon className={`size-4 ${card.text}`} />
                    </div>
                    <p className={`mt-2 text-2xl font-bold ${card.text}`}>
                      {stats[card.key]}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground/80">{card.label}</p>
                  </div>
                )
              })}
            </div>
          )}

          {stats && (
            <div className="mt-8">
              <h2 className="mb-3 text-sm font-semibold text-foreground">Raag Unlock Progress</h2>
              <p className="text-sm text-muted-foreground">
                {stats.raagUnlockCount} / {TOTAL_UNLOCKABLE} raags unlocked
              </p>
              {stats.allRaagsUnlocked ? (
                <p className="mt-1 text-sm text-green-500">All raags unlocked!</p>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">
                  Next unlock at {stats.referralsToNextUnlock} more referrals
                </p>
              )}
              <div className="mt-2 h-2 w-full rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, (stats.raagUnlockCount / TOTAL_UNLOCKABLE) * 100)}%` }}
                />
              </div>
            </div>
          )}

          <div className="mt-8 space-y-3">
            <h2 className="text-sm font-semibold text-foreground">Referral History</h2>
            {referrals.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No referrals yet. Share your referral code to start earning!
              </p>
            ) : (
              referrals.map((ref, i) => {
                const status = statusConfig[ref.status]
                return (
                  <div key={i} className="rounded-xl border border-border bg-background p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">
                        {ref.userName || ref.email || "Unknown"}
                      </p>
                      <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${status.classes}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground/60">
                      {new Date(ref.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )
              })
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-xs text-muted-foreground/60">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="h-8 px-3"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="h-8 px-3"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
