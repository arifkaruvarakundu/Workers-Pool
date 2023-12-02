import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authslice'; 
import passwordModalReducer from './passwordModalSlice'
import passwordReducer from './passwordSlice';
import serviceReducer from './serviceSlice';
// import bookingStatusReducer from './bookingStatusSlice';
import rightDrawerSlice from './RightDrawerSlice';

const store = configureStore({
  reducer: {
    auth: authReducer, 
    passwordModal:passwordModalReducer,
    password: passwordReducer,
    service: serviceReducer,
    // bookingStatus: bookingStatusReducer,
    rightDrawer : rightDrawerSlice,
    
  },

});

export default store;


