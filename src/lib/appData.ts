import { doc, getDoc } from 'firebase/firestore'
import { getFirestoreDb } from './firebase'
import { setConstants } from './constants'

export async function loadAppConstants() {
  try {
    const db = await getFirestoreDb()
    const snap = await getDoc(doc(db, 'app_data', 'constants'))
    if (snap.exists()) {
      setConstants(snap.data())
    }
  } catch (err) {
    console.warn('[appData] Failed to load constants from Firestore', err)
  }
}
