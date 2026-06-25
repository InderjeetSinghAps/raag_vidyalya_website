import { doc, getDoc } from 'firebase/firestore'
import { getFirestoreDb } from './firebase'
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

export async function loadAppConstants() {
  try {
    const db = await getFirestoreDb()
    const snap = await getDoc(doc(db, 'app_data', 'constants'))
    if (snap.exists()) {
      const data = snap.data()
      saveCache(data)
      setConstants(data)
      return
    }
  } catch (err) {
    console.warn('[appData] Failed to load constants from Firestore', err)
  }
  const cached = loadCache()
  if (cached) {
    setConstants(cached)
  }
}
