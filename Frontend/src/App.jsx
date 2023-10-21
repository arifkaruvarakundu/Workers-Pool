import './App.css'
import Loader from './components/Loader'
import Home from './pages/Home'
import SignIn from './pages/SignIn' 
import SignUp from './pages/SignUp'
import OTPVerification from './pages/otpverification'
import React, { useState } from 'react';
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom'

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
        </Routes>
      </Router>
    </>
  )
}

export default App
