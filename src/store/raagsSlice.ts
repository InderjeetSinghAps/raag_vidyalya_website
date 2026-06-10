import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Raag } from '@/types'

interface RaagsState {
  items: Raag[]
  currentRaag: Raag | null
  isLoading: boolean
}

const initialState: RaagsState = {
  items: [],
  currentRaag: null,
  isLoading: false,
}

const raagsSlice = createSlice({
  name: 'raags',
  initialState,
  reducers: {
    setRaags: (state, action: PayloadAction<Raag[]>) => {
      state.items = action.payload
    },
    setCurrentRaag: (state, action: PayloadAction<Raag | null>) => {
      state.currentRaag = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

export const { setRaags, setCurrentRaag, setLoading } = raagsSlice.actions
export default raagsSlice.reducer
