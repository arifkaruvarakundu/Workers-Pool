// rootReducer.js
import { combineReducers } from 'redux';
import userSlice from './userSlice'; // Import your userSlice reducer

// Add more reducers as needed
const rootReducer = combineReducers({
  user: userSlice,
  // Add other reducers here
});

export default rootReducer;


