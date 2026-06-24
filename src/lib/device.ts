import { getToken } from 'firebase/messaging'
import { getMessagingInstance } from './firebase'

const DEVICE_ID_KEY = 'raag_device_id'
const DEVICE_TOKEN_KEY = 'raag_device_token'

export function getDeviceId(): string {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem(DEVICE_ID_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(DEVICE_ID_KEY, id)
  }
  return id
}

export async function getDeviceToken(): Promise<string> {
  if (typeof window === 'undefined') return 'NA'
  const cached = localStorage.getItem(DEVICE_TOKEN_KEY)
  if (cached) return cached
  const messaging = await getMessagingInstance()
  if (!messaging) return 'NA'
  try {
    const config = await fetch('/api/firebase-config').then((r) => r.json())
    const token = await getToken(messaging, { vapidKey: config.vapidKey })
    if (token) {
      localStorage.setItem(DEVICE_TOKEN_KEY, token)
    }
    return token || 'NA'
  } catch {
    return 'NA'
  }
}

export function getDeviceType(): number {
  return 2
}
