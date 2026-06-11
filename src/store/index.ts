import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import languageReducer from './languageSlice'
import coursesReducer from './coursesSlice'
import raagsReducer from './raagsSlice'
import playerReducer from './playerSlice'
import gurbaniReducer from './gurbaniSlice'
import cartReducer from './cartSlice'
import contestsReducer from './contestsSlice'
import { api } from './api'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    language: languageReducer,
    courses: coursesReducer,
    raags: raagsReducer,
    player: playerReducer,
    gurbani: gurbaniReducer,
    cart: cartReducer,
    contests: contestsReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
