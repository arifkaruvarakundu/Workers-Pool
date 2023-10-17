
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  userId: null,
  name: '',
  email: '',
  username: '',
  is_super: false,
  is_worker: false,
  is_active: false,
  first_name: '',
  accessToken: null, 
  refreshToken: null,
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      // Update the state with all fields, including tokens
      state.isAuthenticated = true;
      state.userId = action.payload.userId;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.username = action.payload.username;
      state.is_super = action.payload.is_super;
      state.is_worker = action.payload.is_worker;
      state.is_active = action.payload.is_active;
      state.first_name = action.payload.first_name;
      state.accessToken = action.payload.accessToken; // Set the accessToken
      state.refreshToken = action.payload.refreshToken; // Set the refreshToken
    },
    logout: (state) => {
      // Reset all fields including tokens when logging out
      state.isAuthenticated = false;
      state.userId = null;
      state.name = '';
      state.email = '';
      state.username = '';
      state.is_super = false;
      state.is_worker = false;
      state.is_active = false;
      state.first_name = '';
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export const selectUserData = (state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    userId: state.auth.userId,
    name: state.auth.name,
    email: state.auth.email,
    username: state.auth.username,
    is_super: state.auth.is_super,
    is_worker: state.auth.is_worker,
    is_active: state.auth.is_active,
    first_name: state.auth.first_name,
    accessToken: state.auth.accessToken,
    refreshToken: state.auth.refreshToken,
  };
};
export default authSlice.reducer;
