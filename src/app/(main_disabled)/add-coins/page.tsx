"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Coins, ArrowLeft, Loader2, X, ShieldCheck, HelpCircle, RefreshCw, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGetTransactionHistoryQuery, useAddWalletMoneyMutation } from "@/store/api"
import { getPurchases } from "@/lib/revenuecat"
import { openRazorpayCheckout } from "@/lib/razorpay"
import { toast } from "sonner"
import type { Package } from "@revenuecat/purchases-js"

interface CoinPack {
  rcPackage: Package
  coinAmount: number
  price: number
  priceLabel: string
  priceValue: number
  savePercent: number | null
  isPopular: boolean
}

function extractCoins(pkg: Package): number {
  const m = pkg.webBillingProduct.identifier.match(/(\d+)/)
  return m ? parseInt(m[1], 10) : 0
}

export default function AddCoinsPage() {
  const router = useRouter()
  const { data: txData } = useGetTransactionHistoryQuery({ page: 1, limit: 1 })
  const [addMoney] = useAddWalletMoneyMutation()
  const [packs, setPacks] = useState<CoinPack[]>([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [confirmPack, setConfirmPack] = useState<CoinPack | null>(null)

  const currentBalance =
    txData?.transactions && txData.transactions.length > 0
      ? txData.transactions[0].balanceAfter
      : 0

  const fetchPacks = useCallback(async () => {
    setLoading(true)
    try {
      const purchases = getPurchases()
      if (!purchases) {
        toast.error("Purchase system not available.")
        setLoading(false)
        return
      }
      const offerings = await purchases.getOfferings()
      const current = offerings.current
      if (!current || current.availablePackages.length === 0) {
        toast.error("No packs available right now.")
        setLoading(false)
        return
      }

      let rate = 1
      try {
        const r = await fetch("https://open.er-api.com/v6/latest/USD")
        const d = await r.json()
        rate = d.rates.INR || 1
      } catch {
        rate = 83
      }

      const mapped: CoinPack[] = current.availablePackages
        .filter((pkg) => !pkg.webBillingProduct.normalPeriodDuration && extractCoins(pkg) > 0)
        .map((pkg) => {
          const usd = pkg.webBillingProduct.price.amountMicros / 1_000_000
          const inr = usd * rate
          return {
            rcPackage: pkg,
            coinAmount: extractCoins(pkg),
            price: Math.round(inr * 100),
            priceLabel: new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            }).format(inr),
            priceValue: inr,
            savePercent: null,
            isPopular: false,
          }
        })
        .sort((a, b) => a.coinAmount - b.coinAmount)

      if (mapped.length >= 2) {
        const baseRate = mapped[0].priceValue / mapped[0].coinAmount
        for (const pack of mapped) {
          const packRate = pack.priceValue / pack.coinAmount
          const saved = Math.round((1 - packRate / baseRate) * 100)
          pack.savePercent = saved > 0 ? saved : null
        }
      }

      setPacks(mapped)
    } catch {
      toast.error("Failed to load packs.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPacks()
  }, [fetchPacks])

  async function handlePurchase(pack: CoinPack) {
    setPurchasing(true)
    try {
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
      if (!razorpayKey) throw new Error("Razorpay key not configured")

      await openRazorpayCheckout({
        key: razorpayKey,
        amount: pack.price,
        currency: "INR",
        name: "Raag Vidyalya",
        description: `${pack.coinAmount} Coins`,
        theme: { color: "#CA8A04" },
      })

      await addMoney({ amount: pack.priceValue }).unwrap()

      setConfirmPack(null)
      toast.success("Purchase successful! Coins added to your wallet.")
      router.push("/wallet")
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "Payment cancelled") {
        toast.info("Payment cancelled.")
      } else {
        toast.error("Payment failed. Please try again.")
      }
    } finally {
      setPurchasing(false)
    }
  }

  const isBuying = purchasing

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-12 py-6 md:py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push("/wallet")}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 size-4" /> Back
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost" size="sm"
            onClick={fetchPacks}
            className="text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="mr-1.5 size-4" /> Refresh
          </Button>
          <Button
            variant="ghost" size="sm"
            onClick={() => router.push("/wallet")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronRight className="mr-1.5 size-4" /> History
          </Button>
        </div>
      </div>

      <div className="relative mb-8 md:mb-12 overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-primary/60 p-6 shadow-lg sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12)_0%,transparent_60%)]" />
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex size-12 md:size-14 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
            <Coins className="size-6 md:size-7 text-white" />
          </div>
          <div>
            <p className="text-xs md:text-sm font-medium text-white/70">Wallet Balance</p>
            <p className="text-2xl md:text-3xl font-bold text-white">
              {currentBalance} <span className="text-base md:text-lg font-medium text-white/60">Coins</span>
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : packs.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground">No packs available right now.</p>
          <Button variant="outline" onClick={() => router.push("/wallet")}>Go to Wallet</Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4">
          {packs.map((pack) => (
            <div
              key={pack.rcPackage.identifier}
              className="group flex flex-col items-center justify-between rounded-2xl bg-card p-4 md:p-7 shadow-2xl shadow-yellow-500/10 transition-all duration-250 cursor-pointer hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)] dark:bg-[#1C1C1C]"
            >
              <div className="mb-3 md:mb-4 transition-transform duration-250 group-hover:rotate-[5deg] text-yellow-500">
                <Coins className="size-8 md:size-10" />
              </div>
              <p className="text-3xl md:text-[40px] font-bold leading-none tracking-tight text-foreground dark:text-white">
                {pack.coinAmount}
              </p>
              <p className="mb-3 md:mb-4 text-xs md:text-sm text-muted-foreground/60 dark:text-white/50">Coins</p>
              <div className="mb-3 md:mb-4 h-px w-full bg-border/40 dark:bg-white/[0.06]" />
              <p className="text-xl md:text-[32px] font-bold leading-none tracking-tight text-foreground dark:text-white">
                {pack.priceLabel}
              </p>
              {pack.savePercent && pack.savePercent > 0 && (
                <div className="mt-1.5">
                  <span className="inline-block rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                    Save {pack.savePercent}%
                  </span>
                </div>
              )}
              <Button
                className="mt-4 md:mt-5 h-11 md:h-[50px] w-full rounded-xl bg-gradient-to-r from-yellow-600 to-yellow-500 text-sm md:text-base font-semibold text-white transition-all duration-200 hover:from-yellow-500 hover:to-yellow-400"
                disabled={isBuying}
                onClick={() => setConfirmPack(pack)}
              >
                Buy
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 md:mt-16 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border/40 bg-card/30 p-5 text-center dark:border-white/[0.04]">
          <ShieldCheck className="mx-auto mb-2 size-6 text-emerald-500" />
          <p className="text-sm font-semibold text-foreground dark:text-white/80">Secure Payments</p>
          <p className="mt-1 text-xs text-muted-foreground/60 dark:text-white/50">256-bit encrypted transactions</p>
        </div>
        <div className="rounded-2xl border border-border/40 bg-card/30 p-5 text-center dark:border-white/[0.04]">
          <HelpCircle className="mx-auto mb-2 size-6 text-emerald-500" />
          <p className="text-sm font-semibold text-foreground dark:text-white/80">Billing FAQ</p>
          <p className="mt-1 text-xs text-muted-foreground/60 dark:text-white/50">Refunds & support</p>
        </div>
        <div className="rounded-2xl border border-border/40 bg-card/30 p-5 text-center dark:border-white/[0.04]">
          <RefreshCw className="mx-auto mb-2 size-6 text-emerald-500" />
          <p className="text-sm font-semibold text-foreground dark:text-white/80">Need Help?</p>
          <p className="mt-1 text-xs text-muted-foreground/60 dark:text-white/50">
            <a href="/contact" className="text-emerald-600 hover:text-emerald-500 dark:text-emerald-400">Contact Support</a>
          </p>
        </div>
      </div>

      {confirmPack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-white/[0.08] bg-card p-8 shadow-2xl dark:bg-[#181818]">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground dark:text-white">Confirm Purchase</h3>
              <button onClick={() => !isBuying && setConfirmPack(null)} className="text-muted-foreground hover:text-foreground">
                <X className="size-5" />
              </button>
            </div>
            <div className="my-6 flex flex-col items-center gap-2">
              <Coins className="size-12 text-yellow-500" />
              <p className="text-3xl font-bold text-foreground dark:text-white">{confirmPack.coinAmount} Coins</p>
              <p className="text-xl font-semibold text-muted-foreground dark:text-white/70">{confirmPack.priceLabel}</p>
            </div>
            <div className="mb-6 space-y-2 text-center text-sm text-muted-foreground dark:text-white/60">
              <p className="flex items-center justify-center gap-2">
                <ShieldCheck className="size-4 text-emerald-500" /> Secure Payment
              </p>
              <p>Coins delivered instantly</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl" disabled={isBuying} onClick={() => setConfirmPack(null)}>
                Cancel
              </Button>
              <Button
                className="flex-1 rounded-xl text-base font-semibold text-white transition-all duration-200"
                style={{ background: isBuying ? undefined : "linear-gradient(to right, #CA8A04, #EAB308)" }}
                disabled={isBuying}
                onClick={() => handlePurchase(confirmPack)}
              >
                {isBuying ? (
                  <><Loader2 className="mr-2 size-4 animate-spin" /> Processing...</>
                ) : (
                  "Continue Purchase"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
