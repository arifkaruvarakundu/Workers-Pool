// rootReducer.js

import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // Import your authentication slice and other slices here

const rootReducer = combineReducers({
  auth: authReducer, // Add other slices here
});

export default rootReducer;

