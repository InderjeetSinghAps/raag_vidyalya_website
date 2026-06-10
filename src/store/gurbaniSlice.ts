import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GurbaniItem } from '@/types'

interface GurbaniState {
  items: GurbaniItem[]
  currentItem: GurbaniItem | null
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
    setGurbaniItems: (state, action: PayloadAction<GurbaniItem[]>) => {
      state.items = action.payload
    },
    setCurrentItem: (state, action: PayloadAction<GurbaniItem | null>) => {
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
