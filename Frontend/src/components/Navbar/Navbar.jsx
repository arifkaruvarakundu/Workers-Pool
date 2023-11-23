import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import img from '../../assets/img.png'
import { useDispatch,useSelector } from 'react-redux';
import { setNotAuthenticated } from '../../Redux/authslice';
import { IoIosNotifications } from "react-icons/io";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {wserver} from '../../../server'

function Navbar() {
  
  const [role,setRole]=useState(null)
  const navigateTo = useNavigate();
  const dispatch=useDispatch();
  
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorE2, setAnchorE2] = React.useState(null);
  const open = Boolean(anchorEl);

  const open1 = Boolean(anchorE2);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClick1 = (event) => {
    setAnchorE2(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClose1 = () => {
    setAnchorE2(null);
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
        localStorage.clear();
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

  // useEffect(() => {
  //   const socket = new WebSocket(`ws://${wserver}/ws/chat/${roomName}/`);

  //   socket.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     // Handle the received notification, e.g., show an alert
  //     alert(data.message);
  //   };

  //   return () => {
  //     socket.close();
  //   };
  // }, []);
  
  

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
          <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <IoIosNotifications color='white' size={30}/>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}>Notifications</MenuItem>
        
      </Menu>
    </div>
            {isAuthenticated && role ? (
        <div className="relative group">
          <Button
            id="custom-menu-button"
            aria-controls={open1 ? 'custom-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open1 ? 'true' : undefined}
            onClick={handleClick1}
          >
            <img src={img} alt="User" className="w-10 h-10 rounded-full" />
          </Button>

          <Menu
            id="custom-menu"
            anchorEl={anchorE2}
            open={open1}
            onClose={handleClose1}
            MenuListProps={{
              'aria-labelledby': 'custom-menu-button',
            }}
          >
            {role === 'admin' ? (
              <MenuItem onClick={handleClose1} component={Link} to="/Admin_Dashboard">
                Dashboard
              </MenuItem>
            ) : (
              <MenuItem onClick={handleClose1} component={Link} to="/profile_user">
                Profile
              </MenuItem>
            )}
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
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
