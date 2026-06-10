import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import coursesReducer from './coursesSlice'
import raagsReducer from './raagsSlice'
import playerReducer from './playerSlice'
import gurbaniReducer from './gurbaniSlice'
import cartReducer from './cartSlice'
import storeReducer from './storeSlice'
import contestsReducer from './contestsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: coursesReducer,
    raags: raagsReducer,
    player: playerReducer,
    gurbani: gurbaniReducer,
    cart: cartReducer,
    store: storeReducer,
    contests: contestsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
