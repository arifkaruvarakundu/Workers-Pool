import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { isAuthenticated } from '../isAuthenticated';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigateTo = useNavigate();

  const valid=isAuthenticated()
  console.log(valid)

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  const handleLogout = async () => {
    try {
      // Retrieve the refresh_token from local storage
      const refresh_token=localStorage.getItem('refresh');
  
      // Check if refresh_token is present in local storage
      if (!refresh_token) {
        console.error('Refresh token not found in local storage');
        return;
      }
  
      const response = await axios.post('http://localhost:8000/logout/', {
        refresh_token: refresh_token, // Include the refresh_token in the request data
      });
  
      if (response.status === 205) {
        // The user is logged out, you can update your state or redirect to the login page
        // For example, if using React Router:
        localStorage.removeItem('user');
        localStorage.removeItem('acess');
        localStorage.removeItem('refresh');
        navigateTo('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  

  const handleDropdownClick = () => {
    // Toggle the dropdown when the user avatar is clicked
    setShowDropdown(!showDropdown);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  return (
    <div className="bg-gray-800 p-4 w-full">
      <div className="container">
        <div className="flex justify-between items-center">
          <img src={logo} alt="Logo" className="w-16 h-16" />
          <div className="space-x-4">
            <Link to="/services" className="text-white hover:text-gray-300">
              Home
            </Link>
            <Link to="/services" className="text-white hover:text-gray-300">
              Services
            </Link>
            <Link to="/about" className="text-white hover:text-gray-300">
              About
            </Link>
            <Link to="/contact" className="text-white hover:text-gray-300">
              Contact
            </Link>
          </div>
          {isAuthenticated() ? (
            <div className="relative group">
              <button className="text-white cursor-pointer group-hover:underline" onClick={handleDropdownClick}>
                <img src="#" alt="User" className="w-10 h-10 rounded-full" />
              </button>
              {showDropdown && (
                <div className="absolute bg-white right-0 mt-2 border border-gray-200 p-2 rounded shadow z-10" onClick={closeDropdown}>
                  <Link to="/profile" className="block py-2 px-4 text-gray-800 hover:text-blue-700">
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="block py-2 px-4 text-gray-800 hover:text-blue-700">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/signin" className="bg-white text-blue-500 hover:text-blue-700 px-4 py-2 rounded">
              Sign In / Sign Up
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
