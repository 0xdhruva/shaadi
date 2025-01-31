import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import predictionReducer from './slices/predictionSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    predictions: predictionReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

