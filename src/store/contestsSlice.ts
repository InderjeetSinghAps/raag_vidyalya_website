import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Contest } from '@/types'
import { contests } from '@/data'

interface ContestsState {
  items: Contest[]
  currentContest: Contest | null
  isLoading: boolean
}

const initialState: ContestsState = {
  items: contests,
  currentContest: null,
  isLoading: false,
}

const contestsSlice = createSlice({
  name: 'contests',
  initialState,
  reducers: {
    setContests: (state, action: PayloadAction<Contest[]>) => {
      state.items = action.payload
    },
    setCurrentContest: (state, action: PayloadAction<Contest | null>) => {
      state.currentContest = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

export const { setContests, setCurrentContest, setLoading } = contestsSlice.actions
export default contestsSlice.reducer
