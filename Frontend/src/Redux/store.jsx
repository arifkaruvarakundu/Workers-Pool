import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authslice'; 
import passwordModalReducer from './passwordModalSlice'
import passwordReducer from './passwordSlice';
import serviceReducer from './serviceSlice';
import statusReducer from './statusSlice'

const store = configureStore({
  reducer: {
    auth: authReducer, 
    passwordModal:passwordModalReducer,
    password: passwordReducer,
    service: serviceReducer,
    status: statusReducer,
    
  },

});

export default store;


