import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Language = 'english' | 'hindi' | 'punjabi'

const LANG_KEY = 'app_language'

function loadLanguage(): Language {
  if (typeof window === 'undefined') return 'english'
  return (localStorage.getItem(LANG_KEY) as Language) || 'english'
}

const languageSlice = createSlice({
  name: 'language',
  initialState: loadLanguage(),
  reducers: {
    setLanguage: (_state, action: PayloadAction<Language>) => {
      localStorage.setItem(LANG_KEY, action.payload)
      return action.payload
    },
  },
})

export const { setLanguage } = languageSlice.actions
export default languageSlice.reducer
