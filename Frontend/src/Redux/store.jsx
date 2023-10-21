import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer'; // Import your rootReducer

const store = configureStore({
  reducer: rootReducer,
});

export default store;

