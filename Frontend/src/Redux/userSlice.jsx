import { createSlice } from '@reduxjs/toolkit';
import { getUserDataFromLocalStorage } from './getUserDataFromLocalStorage';
// Define your initial state
const initialState = {
  data: getUserDataFromLocalStorage(),
  loading: false,
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Define a reducer function to set the user's name
    setUserName: (state, action) => {
      state.data.email = action.payload;
    },
  },
});

// Export actions for the reducer function
export const { setUserName } = userSlice.actions;


// Export actions for any reducer functions you might define

export default userSlice.reducer;
