import { createSlice } from '@reduxjs/toolkit';
import type { User } from '../types/custom';

interface AuthState {
  accessToken: string | null;
  user: User | null;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    updateUserProfile(state, action) {
      if (!state.user) return;
      const updated = action.payload;
      if (updated.image) state.user.image = updated.image;
      state.user.phone_number = updated.phone_number;
      state.user.address = updated.address;
    },
    logout(state) {
      state.accessToken = null;
      state.user = null;
    },
  },
});

export const { login, logout, setUser, updateUserProfile, setAccessToken } =
  authSlice.actions;

export default authSlice.reducer;
