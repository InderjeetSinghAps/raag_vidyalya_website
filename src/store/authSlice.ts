import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '@/types'

export const STORAGE_KEY = 'auth_state'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export function loadFromStorage(): AuthState {
  if (typeof window === 'undefined') return { user: null, token: null, isAuthenticated: false, isLoading: false }
  let raw: string | null = null
  try {
    raw = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY)
  } catch {
    return { user: null, token: null, isAuthenticated: false, isLoading: false }
  }
  if (!raw) return { user: null, token: null, isAuthenticated: false, isLoading: false }
  try {
    return JSON.parse(raw)
  } catch {
    return { user: null, token: null, isAuthenticated: false, isLoading: false }
  }
}

function persistToStorage(state: AuthState, rememberMe: boolean) {
  if (typeof window === 'undefined') return
  const raw = JSON.stringify(state)
  if (rememberMe) {
    localStorage.setItem(STORAGE_KEY, raw)
    sessionStorage.removeItem(STORAGE_KEY)
  } else {
    sessionStorage.setItem(STORAGE_KEY, raw)
    localStorage.removeItem(STORAGE_KEY)
  }
}

function clearStorage() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
  sessionStorage.removeItem(STORAGE_KEY)
}

const authSlice = createSlice({
  name: 'auth',
  initialState: loadFromStorage(),
  reducers: {
    setUser: (state, action: PayloadAction<{ user: User; token: string; rememberMe?: boolean }>) => {
      if (action.payload.user.userName && !action.payload.user.name) {
        action.payload.user.name = action.payload.user.userName
      }
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      persistToStorage(
        { user: state.user, token: state.token, isAuthenticated: true, isLoading: false },
        action.payload.rememberMe ?? true,
      )
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      clearStorage()
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
  },
})

export const { setUser, logout, setLoading, updateUser } = authSlice.actions
export default authSlice.reducer
