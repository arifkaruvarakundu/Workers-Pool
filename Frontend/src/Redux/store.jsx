import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authslice'; 
import passwordModalReducer from './passwordModalSlice'
import passwordReducer from './passwordSlice';
import serviceReducer from './serviceSlice';
import statusReducer from './statusSlice'
import rightDrawerSlice from './RightDrawerSlice';

const store = configureStore({
  reducer: {
    auth: authReducer, 
    passwordModal:passwordModalReducer,
    password: passwordReducer,
    service: serviceReducer,
    status: statusReducer,
    rightDrawer : rightDrawerSlice,
    
  },

});

export default store;


