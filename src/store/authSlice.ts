import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types';

export const STORAGE_KEY = 'auth_state';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function loadFromStorage(): AuthState {
  if (typeof window === 'undefined')
    return {
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,
    };
  let raw: string | null = null;
  try {
    raw =
      sessionStorage.getItem(STORAGE_KEY) ||
      localStorage.getItem(STORAGE_KEY);
  } catch {
    return {
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,
    };
  }
  if (!raw)
    return {
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,
    };
  try {
    return JSON.parse(raw);
  } catch {
    return {
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,
    };
  }
}

function persistToStorage(state: AuthState, rememberMe: boolean) {
  if (typeof window === 'undefined') return;
  const raw = JSON.stringify(state);
  if (rememberMe) {
    localStorage.setItem(STORAGE_KEY, raw);
    sessionStorage.removeItem(STORAGE_KEY);
  } else {
    sessionStorage.setItem(STORAGE_KEY, raw);
    localStorage.removeItem(STORAGE_KEY);
  }
}

function clearStorage() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(STORAGE_KEY);
}

const authSlice = createSlice({
  name: 'auth',
  initialState: loadFromStorage(),
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{
        user: User;
        token: string;
        refreshToken?: string;
        rememberMe?: boolean;
      }>,
    ) => {
      const { user, token, refreshToken, rememberMe } =
        action.payload;
      if (user.userName && !user.name) {
        user.name = user.userName;
      }
      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken ?? null;
      state.isAuthenticated = true;
      persistToStorage(
        {
          user,
          token,
          refreshToken: refreshToken ?? null,
          isAuthenticated: true,
          isLoading: false,
        },
        rememberMe ?? true,
      );
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      clearStorage();
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { setUser, logout, setLoading, updateUser } =
  authSlice.actions;
export default authSlice.reducer;
