import { configureStore } from '@reduxjs/toolkit';
import applicationReducer from './slices/applicationSlice';
import aiReducer from './slices/aiSlice';

export const store = configureStore({
  reducer: {
    applications: applicationReducer,
    ai: aiReducer,
  },
});
