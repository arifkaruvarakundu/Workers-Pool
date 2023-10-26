import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: localStorage.getItem('access') ? true : false,
  },
  reducers: {
    setIsAuthenticated: (state) => {
      state.isAuthenticated = true;
    },
    setNotAuthenticated: (state) => {
      state.isAuthenticated = false;
    },
  },
});

export const { setIsAuthenticated, setNotAuthenticated } = authSlice.actions;

export default authSlice.reducer;
