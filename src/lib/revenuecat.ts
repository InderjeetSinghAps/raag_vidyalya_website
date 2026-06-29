import { Purchases } from '@revenuecat/purchases-js'

let purchases: Purchases | null = null

export async function initRevenueCat(userId: string) {
  try {
    const key = process.env.NEXT_PUBLIC_REVENUECAT_API_KEY
    if (!key) {
      console.warn('[rc] RevenueCat key not configured')
      return
    }
    purchases = Purchases.configure(key, userId)
  } catch (err) {
    console.error('[rc] init failed', err)
  }
}

export function getPurchases(): Purchases | null {
  return purchases
}
