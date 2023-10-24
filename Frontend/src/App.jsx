import './App.css'
import React, { useState } from 'react';
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom'
import Loader from './components/Loader'
import Admin_Page from './pages/Admin_Page'
import Home from './pages/Home'
import SignIn from './pages/SignIn' 
import SignUp from './pages/SignUp'
import OTPVerification from './pages/otpverification'
import UserManagement from './pages/usermanagement'
import ServiceManagement from './pages/service_management'
import Profile from './pages/Profile_user';
import Profile_user from './pages/Profile_user';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Set to true when the user is authenticated
  const [userRole, setUserRole] = useState('user'); // Replace with the actual user's role

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home isAuthenticated={isAuthenticated} userRole={userRole} />} />
          <Route path="/signin" element={<SignIn setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/OTPVerification" element={<OTPVerification />} />
          <Route path="/Loader" element={<Loader />} />
          <Route path="/Admin_Page" element={<Admin_Page />} />
          <Route path="/users_workers" element={<UserManagement />} />
          <Route path="/service_management" element={<ServiceManagement />} />
          <Route path="/profile_user" element={<Profile_user />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
