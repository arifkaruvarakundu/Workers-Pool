import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loader from './components/Loader';
import Admin_Page from './pages/Admin_Page';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import OTPVerification from './pages/otpverification';
import UserManagement from './pages/usermanagement';
import ServiceManagement from './pages/service_management';
import Profile_user from './pages/Profile_user';
import { Provider } from 'react-redux';
import store from './Redux/store';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/OTPVerification" element={<OTPVerification />} />
          <Route path="/Loader" element={<Loader />} />
          <Route path="/Admin_Page" element={<Admin_Page />} />
          <Route path="/users_workers" element={<UserManagement />} />
          <Route path="/service_management" element={<ServiceManagement />} />
          <Route path="/profile_user" element={<Profile_user />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
