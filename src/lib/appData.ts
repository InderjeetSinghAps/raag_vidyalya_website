import { doc, getDoc } from 'firebase/firestore'
import { getFirestoreDb } from './firebase'
import { setConstants } from './constants'

const CACHE_KEY = 'app_data_constants'

export async function loadAppConstants() {
  const cached = localStorage.getItem(CACHE_KEY)
  if (cached) {
    try {
      const data = JSON.parse(cached)
      setConstants(data)
      return
    } catch {
      localStorage.removeItem(CACHE_KEY)
    }
  }

  try {
    const db = await getFirestoreDb()
    const snap = await getDoc(doc(db, 'app_data', 'constants'))
    if (snap.exists()) {
      const data = snap.data()
      localStorage.setItem(CACHE_KEY, JSON.stringify(data))
      setConstants(data)
    }
  } catch (err) {
    console.warn('[appData] Failed to load constants from Firestore', err)
  }
}
