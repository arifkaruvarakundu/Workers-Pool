import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setIsAuthenticated } from '../Redux/authslice';
import { useDispatch, useSelector } from 'react-redux';
import AxiosInstance from '../../axios_instance';

function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigateTo = useNavigate();
  const axios=AxiosInstance()

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post('token/', formData)
      .then((response) => {
        console.log('Sign-in successful', response.data);

        const userRole = response.data.role;
        const userProfileImage = response.data.profileImage;

        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('access', response.data.access);
        localStorage.setItem('refresh', response.data.refresh);
        localStorage.setItem('user_role', response.data.user_role);
        localStorage.setItem('user_id', response.data.id);

        dispatch(setIsAuthenticated());

        navigateTo('/');
      })
      .catch((error) => {
        console.error('Sign-in error', error);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-200 to-indigo-500 flex justify-center items-center">
      <div className="p-4 bg-white rounded-lg shadow-lg flex flex-col justify-center items-center w-[35%]">
        <h2 className="text-2xl font-bold mb-4 bg-gray-200 py-2 px-4 rounded-tl-lg rounded-tr-lg">
          Sign In
        </h2>
        <form className="space-y-4 w-full px-10">
          <div>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-3"
            >
              Sign In
            </button>
          </div>
        </form>
        <p className="text-center py-5">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign up here
          </Link>
        </p>
        <ToastContainer />
      </div>
    </div>
  );
}

export default SignIn;
