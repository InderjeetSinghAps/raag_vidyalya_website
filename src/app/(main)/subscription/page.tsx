"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Check, Sparkles } from "lucide-react"
import { getPurchases } from "@/lib/revenuecat"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Package } from "@revenuecat/purchases-js"

interface Plan {
  rcPackage: Package
  title: string
  price: string
  period: string
  description: string | null
}

export default function SubscriptionPage() {
  const router = useRouter()
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const purchases = getPurchases()
        if (!purchases) {
          setError("Purchase system not available.")
          setLoading(false)
          return
        }
        const offerings = await purchases.getOfferings()
        const current = offerings.current
        if (!current || current.availablePackages.length === 0) {
          setError("No plans available right now.")
          setLoading(false)
          return
        }
        const mapped: Plan[] = current.availablePackages.map((pkg) => ({
          rcPackage: pkg,
          title: pkg.webBillingProduct.title,
          price: pkg.webBillingProduct.price.formattedPrice,
          period: pkg.webBillingProduct.normalPeriodDuration ?? "",
          description: pkg.webBillingProduct.description,
        }))
        mapped.sort((a, b) => a.rcPackage.webBillingProduct.price.amountMicros - b.rcPackage.webBillingProduct.price.amountMicros)
        setPlans(mapped)
      } catch {
        setError("Failed to load plans. Please try again.")
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const features = [
    "Access to all raag courses",
    "Download sheet music PDFs",
    "Ad-free experience",
    "Priority support",
  ]

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">{error}</p>
        <Button variant="outline" onClick={() => router.back()}>
          Go back
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Unlock Premium</h1>
        <p className="mt-2 text-muted-foreground">
          Get full access to our complete collection of raag courses and sheet music.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan, i) => (
          <Card
            key={plan.rcPackage.identifier}
            size={i === 1 ? "default" : "sm"}
            className={`relative flex flex-col ${i === 1 ? "scale-[1.03] border-primary/50 shadow-lg" : ""}`}
          >
            {i === 1 && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="gap-1 bg-primary text-primary-foreground">
                  <Sparkles className="size-3" />
                  Recommended
                </Badge>
              </div>
            )}

            <CardHeader>
              <CardTitle>{plan.title}</CardTitle>
              {plan.description && (
                <CardDescription>{plan.description}</CardDescription>
              )}
            </CardHeader>

            <CardContent className="flex-1 space-y-6">
              <div>
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="ml-1 text-sm text-muted-foreground">
                    /{plan.period === "P1M" ? "month" : plan.period === "P1Y" ? "year" : plan.period.toLowerCase()}
                  </span>
                )}
              </div>

              <ul className="space-y-2">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button
                className="w-full"
                variant={i === 1 ? "default" : "outline"}
                size="lg"
                onClick={() => {
                  const p = getPurchases()
                  if (p) {
                    p.purchasePackage(plan.rcPackage).catch(() => {})
                  }
                }}
              >
                Subscribe - {plan.price}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
