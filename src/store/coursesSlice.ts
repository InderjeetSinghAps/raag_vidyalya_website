import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CoursesState {
  enrolledCourses: string[]
}

const initialState: CoursesState = {
  enrolledCourses: [],
}

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    enrollCourse: (state, action: PayloadAction<string>) => {
      if (!state.enrolledCourses.includes(action.payload)) {
        state.enrolledCourses.push(action.payload)
      }
    },
  },
})

export const { enrollCourse } = coursesSlice.actions
export default coursesSlice.reducer
