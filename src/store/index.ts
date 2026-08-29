import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import doctorsSlice from './doctorSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    doctors: doctorsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
