import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authslice'; 
import passwordModalReducer from './passwordModalSlice'
import passwordReducer from './passwordSlice';

const store = configureStore({
  reducer: {
    auth: authReducer, 
    passwordModal:passwordModalReducer,
    password: passwordReducer,
    
  },
});

export default store;


