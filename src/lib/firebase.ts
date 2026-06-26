import { initializeApp, getApps, getApp } from 'firebase/app'
import type { FirebaseApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import type { Firestore } from 'firebase/firestore'
import { getMessaging, isSupported } from 'firebase/messaging'
import type { Messaging } from 'firebase/messaging'

const CONFIG_CACHE_KEY = 'firebase_config'

let app: FirebaseApp | null = null
let initPromise: Promise<FirebaseApp> | null = null

function getCachedConfig(): Record<string, string | undefined> | null {
  try {
    const raw = localStorage.getItem(CONFIG_CACHE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function setCachedConfig(config: Record<string, string | undefined>) {
  localStorage.setItem(CONFIG_CACHE_KEY, JSON.stringify(config))
}

export async function getFirebaseApp(): Promise<FirebaseApp> {
  if (app) return app
  if (initPromise) return initPromise

  initPromise = (async () => {
    if (getApps().length > 0) {
      app = getApp()
      return app
    }

    let config = getCachedConfig()
    if (!config) {
      config = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
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

let db: Firestore | null = null
let messagingInstance: Messaging | null = null

export async function getFirestoreDb(): Promise<Firestore> {
  if (db) return db
  const firebaseApp = await getFirebaseApp()
  db = getFirestore(firebaseApp)
  return db
}

export async function getMessagingInstance(): Promise<Messaging | null> {
  if (messagingInstance) return messagingInstance
  const supported = await isSupported()
  if (!supported) return null
  const firebaseApp = await getFirebaseApp()
  messagingInstance = getMessaging(firebaseApp)
  return messagingInstance
}
