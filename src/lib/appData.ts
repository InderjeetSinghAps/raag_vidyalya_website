import { doc, getDoc } from 'firebase/firestore'
import { getFirestoreDb, isFirebaseConfigured } from './firebase'
import { setConstants } from './constants'

const CACHE_KEY = 'app_data_constants'

function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? (JSON.parse(raw) as Record<string, unknown>) : null
  } catch {
    localStorage.removeItem(CACHE_KEY)
    return null
  }
}

function saveCache(data: Record<string, unknown>) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
  } catch {
    /* quota exceeded */
  }
}

const FALLBACK_DEFAULTS: Record<string, unknown> = {
  base_url:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'http://localhost:3000/api/v1',
  media_base_url:
    process.env.NEXT_PUBLIC_MEDIA_BASE_URL ||
    'http://localhost:3000',
  youtube_channel_link: 'https://youtube.com/@raagvidyalya',
}

export async function loadAppConstants() {
  const cached = loadCache()

  if (!isFirebaseConfigured()) {
    setConstants({ ...FALLBACK_DEFAULTS, ...(cached || {}) })
    return
  }

  try {
    const db = await getFirestoreDb()
    if (!db) {
      setConstants({ ...FALLBACK_DEFAULTS, ...(cached || {}) })
      return
    }

    const snap = await Promise.race([
      getDoc(doc(db, 'app_data', 'constants')),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Firestore read timed out')), 5000),
      ),
    ])
    if (snap.exists()) {
      const data = snap.data()
      saveCache(data)
      setConstants({ ...FALLBACK_DEFAULTS, ...data })
      return
    }
  } catch (err) {
    console.warn('[appData] Failed to load constants from Firestore', err)
  }

  setConstants({ ...FALLBACK_DEFAULTS, ...(cached || {}) })
}
