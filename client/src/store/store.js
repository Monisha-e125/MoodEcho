import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import moodReducer from './slices/moodSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    mood: moodReducer,
    ui: uiReducer
  },
  devTools: import.meta.env.DEV
});