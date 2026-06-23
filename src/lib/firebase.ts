import { initializeApp, getApps, getApp } from 'firebase/app'
import type { FirebaseApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import type { Firestore } from 'firebase/firestore'

const CONFIG_CACHE_KEY = 'firebase_config'

let app: FirebaseApp | null = null
let initPromise: Promise<FirebaseApp> | null = null

async function fetchConfigFromServer(): Promise<Record<string, string | undefined>> {
  const res = await fetch('/api/firebase-config')
  if (!res.ok) throw new Error('Failed to fetch Firebase config')
  return res.json()
}

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
      config = await fetchConfigFromServer()
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

export async function getFirestoreDb(): Promise<Firestore> {
  if (db) return db
  const firebaseApp = await getFirebaseApp()
  db = getFirestore(firebaseApp)
  return db
}
