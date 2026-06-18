"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Wallet, ArrowDownRight, ArrowUpRight, ChevronLeft, ChevronRight, Loader2, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useGetTransactionHistoryQuery } from "@/store/api"
import type { Transaction } from "@/types"

const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
}

function TransactionIcon({ type }: { type: "credit" | "debit" }) {
  if (type === "credit") {
    return (
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
        <ArrowDownRight className="size-5 text-emerald-500" />
      </div>
    )
  }
  return (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-500/10">
      <ArrowUpRight className="size-5 text-red-500" />
    </div>
  )
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

function TransactionRow({ tx }: { tx: Transaction }) {
  return (
    <div className="group/item flex items-center gap-3 px-4 py-3.5 transition-all duration-200 hover:bg-white/[0.02]">
      <TransactionIcon type={tx.type} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {tx.title}
        </p>
        <p className="truncate text-xs text-muted-foreground/60">
          {formatDate(tx.createdAt)} at {formatTime(tx.createdAt)}
        </p>
      </div>
      <div className="text-right">
        <p className={`text-sm font-semibold ${tx.type === "credit" ? "text-emerald-500" : "text-red-500"}`}>
          {tx.type === "credit" ? "+" : "-"}{tx.amount}
        </p>
        <p className="text-[10px] text-muted-foreground/40">
          Balance: {tx.balanceAfter}
        </p>
      </div>
    </div>
  )
}

function TransactionSkeleton() {
  return (
    <div className="space-y-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex animate-pulse items-center gap-3 px-4 py-3.5">
          <div className="size-10 rounded-full bg-muted" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 w-48 rounded bg-muted" />
            <div className="h-3 w-28 rounded bg-muted" />
          </div>
          <div className="space-y-1.5 text-right">
            <div className="ml-auto h-3.5 w-16 rounded bg-muted" />
            <div className="ml-auto h-3 w-14 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function WalletPage() {
  const router = useRouter()
  const [page, setPage] = useState(1)

  const { data, isLoading, isFetching, error } = useGetTransactionHistoryQuery({ page, limit: 15 })

  const transactions = data?.transactions ?? []
  const totalPages = data?.totalPages ?? 1
  const currentBalance = transactions.length > 0 ? transactions[0].balanceAfter : 0

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        animate="show"
        variants={staggerItem}
        transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
      >
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 size-4" />
          Back
        </Button>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={staggerItem}
        transition={{ duration: 0.5, ease: [0.2, 0, 0, 1], delay: 0.05 }}
        className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-primary/60 p-6 shadow-lg sm:p-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12)_0%,transparent_60%)]" />
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />

        <div className="relative flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
            <Wallet className="size-7 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-white/70">Wallet Balance</p>
            <p className="text-3xl font-bold text-white">
              {currentBalance} <span className="text-lg font-medium text-white/60">Coins</span>
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={staggerItem}
        transition={{ duration: 0.5, ease: [0.2, 0, 0, 1], delay: 0.1 }}
        className="overflow-hidden rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl dark:border-white/[0.06] dark:bg-white/[0.04]"
      >
        <div className="h-0.5 w-full bg-gradient-to-r from-primary/40 via-primary/20 to-transparent" />

        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground/60">
            Transaction History
          </h2>
          {data && (
            <p className="text-[10px] text-muted-foreground/40">
              {data.total} transaction{data.total !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {isLoading ? (
          <TransactionSkeleton />
        ) : error ? (
          <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-red-500/10">
              <AlertCircle className="size-6 text-red-500" />
            </div>
            <p className="text-sm text-muted-foreground">Failed to load transactions</p>
            <Button variant="outline" size="sm" onClick={() => setPage(1)}>
              Try Again
            </Button>
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
              <Wallet className="size-6 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground">No transactions yet</p>
            <p className="text-xs text-muted-foreground/60">
              Your transaction history will appear here
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-border/40">
              {transactions.map((tx) => (
                <TransactionRow key={tx._id} tx={tx} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-border/40 px-4 py-3">
                <p className="text-xs text-muted-foreground/60">
                  Page {page} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1 || isFetching}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="h-8 w-8 p-0"
                  >
                    {isFetching ? <Loader2 className="size-3.5 animate-spin" /> : <ChevronLeft className="size-3.5" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages || isFetching}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="h-8 w-8 p-0"
                  >
                    {isFetching ? <Loader2 className="size-3.5 animate-spin" /> : <ChevronRight className="size-3.5" />}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  )
}
