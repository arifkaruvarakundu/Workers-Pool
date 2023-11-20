

import { createSlice } from '@reduxjs/toolkit';

const serviceSlice = createSlice({
  name: 'service',
  initialState: {
    serviceId: null,
  },
  reducers: {
    setServiceId: (state, action) => {
      state.serviceId = action.payload;
    },
  },
});

export const { setServiceId } = serviceSlice.actions;

export const selectServiceId = (state) => state.service.serviceId;

export default serviceSlice.reducer;
