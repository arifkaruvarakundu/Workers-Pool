// // bookingStatusSlice.js
// import { createSlice } from '@reduxjs/toolkit';

// const bookingStatusSlice = createSlice({
//   name: 'bookingStatus',
//   initialState: {},
//   reducers: {
//     setBookingStatus: (state, action) => {
//       console.log("hai how are bookin status")
//       const { bookingId, status } = action.payload;
//       state[bookingId] = status;
//     },
//   },
// });

// export const { setBookingStatus } = bookingStatusSlice.actions;
// export const selectBookingStatus = (state, bookingId) => state.bookingStatus[bookingId];
// export default bookingStatusSlice.reducer;
