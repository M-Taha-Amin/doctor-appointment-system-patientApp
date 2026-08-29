import { createSlice } from '@reduxjs/toolkit';
import type { Doctor } from '../types/custom';

type DoctorsState = {
  doctors: Doctor[];
};

const initialState: DoctorsState = {
  doctors: [],
};

export const doctorsSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    setDoctors(state, action) {
      state.doctors = action.payload;
    },
  },
});

export const { setDoctors } = doctorsSlice.actions;

export default doctorsSlice.reducer;