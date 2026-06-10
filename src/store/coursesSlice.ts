import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Course } from '@/types'
import { courses as mockCourses } from '@/data'

interface CoursesState {
  allCourses: Course[]
  enrolledCourses: string[]
  currentCourse: Course | null
  isLoading: boolean
}

const initialState: CoursesState = {
  allCourses: mockCourses,
  enrolledCourses: [],
  currentCourse: null,
  isLoading: false,
}

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setCurrentCourse: (state, action: PayloadAction<Course | null>) => {
      state.currentCourse = action.payload
    },
    enrollCourse: (state, action: PayloadAction<string>) => {
      if (!state.enrolledCourses.includes(action.payload)) {
        state.enrolledCourses.push(action.payload)
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

export const { setCurrentCourse, enrollCourse, setLoading } = coursesSlice.actions
export default coursesSlice.reducer
