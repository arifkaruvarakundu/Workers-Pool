import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  // Show the "Please wait" alert

    showPleaseWaitAlert();
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Password Mismatch',
        text: 'Passwords do not match. Please check your input.',
      });
      return; // Stop execution if passwords don't match
    }

    axios.post('http://127.0.0.1:8000/signup/', formData, {headers:{'Content-Type' : 'application/json'}, withCredentials : true })
      .then((response) => {
        
        // Handle the successful response here
        console.log('Otp sent successfully:', response.data);
        const email = formData.email;
        closePleaseWaitAlert();
        showSuccessAlert(email);
        
        // Navigate to the OTP verification page
        navigate('/OTPVerification');
      })
      .catch((error) => {
        // Handle any errors here
        console.error('Registration failed:', error);
        closePleaseWaitAlert();
        let errorMessage = 'Registration failed. Please try again later.'; // Default error message

  // Check if the error response contains a custom error message
        if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error; // Use the custom error message from the response
        }

        showErrorAlert(errorMessage);
      });
  };


  const showPleaseWaitAlert = () => {
    setIsLoading(true);

    Swal.fire({
      icon: 'info',
      title: 'Please Wait',
      text: ' we are verifiying your details',
      allowOutsideClick: false,
      showConfirmButton: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      },
    });
  };

  // Function to close the "Please wait" alert
  const closePleaseWaitAlert = () => {
    setIsLoading(false);
    Swal.close();
  };

  // Function to show a success alert
  const showSuccessAlert = (email) => {
    Swal.fire({
      icon: 'success',
      title: 'Enter your OTP',
      text: `OTP sent to your ${email} successfully.`,
    });
  };

  // Function to show an error alert
  const showErrorAlert = (errorMessage) => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: errorMessage,
    });
  };


  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
        <input type="hidden" name="csrfmiddlewaretoken" value="{% csrf_token %}" />
          <input type="hidden" name="csrfmiddlewaretoken" value="{% csrf_token %}" />
          <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
              Select Your Role
            </label>
            <select
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="worker">Worker</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Sign Up
          </button>
        </div>
        </form>
        <p className="text-center">
          Already have an account?{' '}
          <Link to="/signin" className="text-blue-500 hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
