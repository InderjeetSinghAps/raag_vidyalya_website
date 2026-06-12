import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface TrackInfo {
  id: string
  title: string
  artist: string
  audioUrl: string
  image: string
  duration: string
}

interface PlayerState {
  currentTrack: TrackInfo | null
  isPlaying: boolean
  isMiniPlayer: boolean
  volume: number
  progress: number
  currentTime: number
  duration: number
  playlist: TrackInfo[]
}

const initialState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  isMiniPlayer: false,
  volume: 0.8,
  progress: 0,
  currentTime: 0,
  duration: 0,
  playlist: [],
}

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    playTrack: (state, action: PayloadAction<TrackInfo>) => {
      state.currentTrack = action.payload
      state.isPlaying = true
      state.progress = 0
    },
    pauseTrack: (state) => {
      state.isPlaying = false
    },
    resumeTrack: (state) => {
      if (state.currentTrack) {
        state.isPlaying = true
      }
    },
    stopTrack: (state) => {
      state.currentTrack = null
      state.isPlaying = false
      state.progress = 0
    },
    setProgress: (state, action: PayloadAction<number>) => {
      state.progress = action.payload
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = Math.max(0, Math.min(1, action.payload))
    },
    toggleMiniPlayer: (state) => {
      state.isMiniPlayer = !state.isMiniPlayer
    },
    showMiniPlayer: (state) => {
      state.isMiniPlayer = true
    },
    setPlaylist: (state, action: PayloadAction<TrackInfo[]>) => {
      state.playlist = action.payload
    },
  },
})

export const {
  playTrack, pauseTrack, resumeTrack, stopTrack,
  setProgress, setCurrentTime, setDuration, setVolume, toggleMiniPlayer, showMiniPlayer,
  setPlaylist,
} = playerSlice.actions
export default playerSlice.reducer
