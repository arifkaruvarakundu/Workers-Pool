import { createSlice } from '@reduxjs/toolkit';


const passwordSlice = createSlice({
  name: 'password',
  initialState: {
    newPassword: '',
    confirmPassword: '',
  },
  reducers: {
    setNewPassword: (state, action) => {
      state.newPassword = action.payload;
    },
    setConfirmPassword: (state, action) => {
      state.confirmPassword = action.payload;
    },
  },
});

export const { setNewPassword, setConfirmPassword } = passwordSlice.actions;
export default passwordSlice.reducer;
