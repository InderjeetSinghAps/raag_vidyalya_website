import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GurbaniBaani } from '@/types'

interface GurbaniState {
  items: GurbaniBaani[]
  currentItem: GurbaniBaani | null
  isFullScreen: boolean
  isLoading: boolean
}

const initialState: GurbaniState = {
  items: [],
  currentItem: null,
  isFullScreen: false,
  isLoading: false,
}

const gurbaniSlice = createSlice({
  name: 'gurbani',
  initialState,
  reducers: {
    setGurbaniItems: (state, action: PayloadAction<GurbaniBaani[]>) => {
      state.items = action.payload
    },
    setCurrentItem: (state, action: PayloadAction<GurbaniBaani | null>) => {
      state.currentItem = action.payload
    },
    toggleFullScreen: (state) => {
      state.isFullScreen = !state.isFullScreen
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

export const { setGurbaniItems, setCurrentItem, toggleFullScreen, setLoading } = gurbaniSlice.actions
export default gurbaniSlice.reducer
