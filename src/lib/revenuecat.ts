import { Purchases } from "@revenuecat/purchases-js"

let purchases: Purchases | null = null

export async function initRevenueCat(userId: string) {
  const key = process.env.NEXT_PUBLIC_REVENUECAT_API_KEY
  if (!key) return
  purchases = Purchases.configure({ apiKey: key, appUserId: userId })
}

export function getPurchases(): Purchases | null {
  return purchases
}
