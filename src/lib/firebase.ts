import { initializeApp, getApps, getApp } from 'firebase/app'
import type { FirebaseApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import type { Firestore } from 'firebase/firestore'
// import { getMessaging, isSupported } from 'firebase/messaging'
// import type { Messaging } from 'firebase/messaging'
// import { getMessaging, isSupported } from 'firebase/messaging'
// import type { Messaging } from 'firebase/messaging'

const CONFIG_CACHE_KEY = 'firebase_config'

let app: FirebaseApp | null = null
let initPromise: Promise<FirebaseApp> | null = null

export function isFirebaseConfigured(): boolean {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  return Boolean(apiKey && apiKey.trim() !== '' && projectId && projectId.trim() !== '')
}

function getCachedConfig(): Record<string, string | undefined> | null {
  try {
    const raw = localStorage.getItem(CONFIG_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && parsed.apiKey && parsed.projectId) {
      return parsed
    }
    localStorage.removeItem(CONFIG_CACHE_KEY)
    return null
  } catch {
    localStorage.removeItem(CONFIG_CACHE_KEY)
    return null
  }
}

function setCachedConfig(config: Record<string, string | undefined>) {
  try {
    if (config.apiKey && config.projectId) {
      localStorage.setItem(CONFIG_CACHE_KEY, JSON.stringify(config))
    }
  } catch {
    /* quota exceeded */
  }
}

export async function getFirebaseApp(): Promise<FirebaseApp> {
  if (app) return app
  if (initPromise) return initPromise

  initPromise = (async () => {
    if (getApps().length > 0) {
      app = getApp()
      return app
    }

    if (!isFirebaseConfigured()) {
      throw new Error(
        'Firebase is not configured. Please set NEXT_PUBLIC_FIREBASE_API_KEY and NEXT_PUBLIC_FIREBASE_PROJECT_ID in .env.local',
      )
    }

    let config = getCachedConfig()
    if (!config) {
      config = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain:
          process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
          `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket:
          process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
          `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebasestorage.app`,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      }
      setCachedConfig(config)
    }

    app = initializeApp({
      apiKey: config.apiKey,
      authDomain: config.authDomain,
      projectId: config.projectId,
      storageBucket: config.storageBucket,
      messagingSenderId: config.messagingSenderId,
      appId: config.appId,
    })
    return app
  })()

  return initPromise
}

// let messagingInstance: Messaging | null = null

// export async function getMessagingInstance(): Promise<Messaging | null> {
//   if (messagingInstance) return messagingInstance
//   const supported = await isSupported()
//   if (!supported) return null
//   const firebaseApp = await getFirebaseApp()
//   messagingInstance = getMessaging(firebaseApp)
//   return messagingInstance
// }

let db: Firestore | null = null
// let messagingInstance: Messaging | null = null

export async function getFirestoreDb(): Promise<Firestore | null> {
  if (!isFirebaseConfigured()) return null
  if (db) return db
  try {
    const firebaseApp = await getFirebaseApp()
    db = getFirestore(firebaseApp)
    return db
  } catch {
    return null
  }
}


