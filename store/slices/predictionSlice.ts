import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Prediction, UserPrediction } from '../../types/predictions'

interface PredictionState {
  predictions: Prediction[]
  userPredictions: UserPrediction[]
}

const initialState: PredictionState = {
  predictions: [],
  userPredictions: [],
}

const predictionSlice = createSlice({
  name: 'predictions',
  initialState,
  reducers: {
    setPredictions: (state, action: PayloadAction<Prediction[]>) => {
      state.predictions = action.payload
    },
    addUserPrediction: (state, action: PayloadAction<UserPrediction>) => {
      state.userPredictions.push(action.payload)
    },
    clearUserPredictions: (state) => {
      state.userPredictions = []
    },
  },
})

export const { setPredictions, addUserPrediction, clearUserPredictions } = predictionSlice.actions
export default predictionSlice.reducer

