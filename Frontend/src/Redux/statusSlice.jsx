// statusSlice.js
import { createSlice } from '@reduxjs/toolkit';

const statusSlice = createSlice({
  name: 'status',
  initialState: {
    value: 'Pending',
  },
  reducers: {
    setStatus: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setStatus } = statusSlice.actions;
export const selectStatus = (state) => state.status.value;
export default statusSlice.reducer;
