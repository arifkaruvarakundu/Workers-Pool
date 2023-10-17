import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

function Navbar({ isAuthenticated, profileImage }) {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
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
          {isAuthenticated ? (
            <div className="relative group">
              <button className="text-white focus:outline-none" onClick={toggleDropdown}>
                <img
                  src={profileImage} // Use the user's profile image
                  alt="User"
                  className="w-10 h-10 rounded-full cursor-pointer"
                />
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2">
                  <div className="bg-white rounded-md shadow-lg">
                    <ul>
                      <li>
                        <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link to="/logout" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                          Logout
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/signin">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                SignUp/SignIn
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;

