import React, { useEffect, useState,useRef } from 'react';
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
import { ToastContainer, toast } from 'react-toastify';
import AxiosInstance from './../../../axios_instance';
// import WebSocketService from './WebSocketService';

function Navbar() {
  
  const [role,setRole]=useState(null)
  const navigateTo = useNavigate();
  const dispatch=useDispatch();
  const axios = AxiosInstance()
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorE2, setAnchorE2] = React.useState(null);
  const [notifications, setNotifications] = useState([]);
  const open = Boolean(anchorEl);
  const user = JSON.parse(localStorage.getItem('user'));
  const username = user && user.username;
  const open1 = Boolean(anchorE2);
  const userId=localStorage.getItem('user_id')

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
  
      const response = await axios.post('logout/', {
        refresh_token: refresh_token, 
      });
  
      if (response.status === 205) {
        localStorage.clear();
        dispatch(setNotAuthenticated());
        navigateTo('/');
        toast.success('You logout successfully',{
          autoClose: 5000,});
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

   


    useEffect(() => {
      const connectToWebSocket = (userId) => {
        if (role === 'user') {
         
          return null;
        }
    
        const roomName = `${userId}`;
        const client = new WebSocket(`wss://${wserver}/wss/notification/${roomName}/`);
    
        client.onopen = () => {
          console.log('WebSocket connection established');
        };
    
        client.onmessage = (message) => {
          console.log('Received WebSocket message:', message);
          const data = JSON.parse(message.data);
          console.log(data);
          setNotifications((prevNotifications) => [...prevNotifications, data.notification_data]);
        };
    
        client.onerror = (error) => {
          console.error('WebSocket error:', error);
        };
    
        return client;
      };
    
    
      if (role !== 'user') {
        const client = connectToWebSocket(userId);
    
      
        return () => {
          if (client) {
           
            setTimeout(() => {
              client.close();
            },1000); 
          }
        };
      }
    
     
      return () => {};
    }, [userId, role]);
    





   
    
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
            <Link to="/About" className="text-white hover:text-gray-300">
              About
            </Link>
            <Link to="/Contacts" className="text-white hover:text-gray-300">
              Contact
            </Link>
          </div>
            {isAuthenticated && role === 'user' ? (
            // Render nothing for users
            null
          ) : (
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
        {console.log(notifications)}{notifications.map((notification) => (
                <MenuItem key={notification.id} onClick={handleClose}>
                  <Link to={"/worklog_worker"}>{notification}</Link>
                  
                </MenuItem>
              ))}
      </Menu>
    </div>
     )}
    <div className='text-white'>{username}</div>
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
      <ToastContainer />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
