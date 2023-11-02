import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import img from '../../assets/img.png'
import { useDispatch, useSelector} from 'react-redux';
import { setNotAuthenticated } from '../../Redux/authslice';


function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [role,setRole]=useState(null)
  const navigateTo = useNavigate();
  const dispatch=useDispatch();
  
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };


  const handleLogout = async () => {
    try {
      
      const refresh_token=localStorage.getItem('refresh');
  
      if (!refresh_token) {
        console.error('Refresh token not found in local storage');
        return;
      }
  
      const response = await axios.post('http://localhost:8000/logout/', {
        refresh_token: refresh_token, 
      });
  
      if (response.status === 205) {
       
        localStorage.removeItem('user');
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('user_role');
        dispatch(setNotAuthenticated());
        navigateTo('/');
      }
    } catch (error) {   
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const value = localStorage.getItem('user_role')?.trim();
    if (value) {
      setRole(value);
    }
  }, []);
  
  

  return (
    <div className="bg-gray-800 p-4 w-full">
      <div className="container">
        <div className="flex justify-between items-center">
          <img src={logo} alt="Logo" className="w-16 h-16" />
          <div className="space-x-16">
            <Link to="/" className="text-white hover:text-gray-300">
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
          {isAuthenticated && role ? (
            <div className="relative group">
              <button className="text-white cursor-pointer group-hover:underline" onClick={toggleDropdown}>
                <img src={img} alt="User" className="w-10 h-10 rounded-full" />
              </button>
              {showDropdown && (
                <div className="absolute bg-white right-0 mt-2 border border-gray-200 p-2 rounded shadow z-10">
                  
                  {role === "admin" ? (
                    <Link to="/Admin_Page" className="block py-2 px-4 text-gray-800 hover:text-blue-700">
                      Dashboard
                    </Link>
                  ) : (
                    <Link to="/profile_user" className="block py-2 px-4 text-gray-800 hover:text-blue-700">
                      Profile
                    </Link>
                  )}
                  <button onClick={handleLogout} className="block py-2 px-4 text-gray-800 hover:text-blue-700">
                    Logout
                  </button>
                </div>
              )}

            </div>
          ) : (
            <Link to="/signin" className="bg-white text-blue-500 hover:text-blue-700 px-4 py-2 rounded">
              SignIn / SignUp
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
