import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Loader from '../components/Loader'; 


function OTPVerification() {
  const [otp, setOTP] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { value } = e.target;
    setOTP(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Show the "Please wait" alert
    showPleaseWaitAlert();

    axios
      .post('http://127.0.0.1:8000/verify_registration_otp/', { otp }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      })
      .then((response) => {
        // Handle the successful response here
        console.log('OTP verification successful:', response.data);
        closePleaseWaitAlert();
        setIsLoading(false);

        // Redirect to the registration success page or another appropriate page
        navigate('/signin');
      })
      .catch((error) => {
        // Handle any errors here
        console.error('OTP verification failed:', error);
        closePleaseWaitAlert();
        setIsLoading(false);

        // Show an error alert
        showErrorAlert('Invalid OTP');
      });
  };

  const showPleaseWaitAlert = () => {
    Swal.fire({
      icon: 'info',
      title: 'Please Wait',
      text: 'Verifying OTP...',
      allowOutsideClick: false,
      showConfirmButton: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      },
    });
  };

  const closePleaseWaitAlert = () => {
    Swal.close();
  };

  const showErrorAlert = (errorMessage) => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: errorMessage,
    });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      {isLoading ? ( // Render the loader if loading is true
        <Loader />
      ) : (
      
      <div className="w-full max-w-md">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-center mb-4">OTP Verification</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="otp">
              Enter OTP
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="otp"
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={otp}
              onChange={handleChange}
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Verify OTP
            </button>
          </div>
        </form>
        <p className="text-center">
          Back to{' '}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
      )}
    </div>
  );
}

export default OTPVerification;
