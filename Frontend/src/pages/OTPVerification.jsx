import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar/Navbar';
import logo from '../../assets/logo.png';



import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const OTPVerification = () => {
  const [otp, setOTP] = useState(['', '', '', '', '', '']);
  const otpFields = Array(6).fill(0);
  const otpInputRefs = otpFields.map(() => useRef(null));
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()
  

  const handleOTPChange = (e, index) => {
    const value = e.target.value;
    if (/^\d+$/.test(value) || value === '') {
      // Update the OTP digit at the specified index.
      const updatedOTP = [...otp];
      updatedOTP[index] = value;
      setOTP(updatedOTP);
  
      // Move focus to the previous input field (if available) after deletion.
      if (value === '' && index > 0) {
        otpInputRefs[index  ].current.focus();
      } else if (index < 5 && value !== '') {
        // Move focus to the next input field (if available) after entering a digit.
        otpInputRefs[index + 1].current.focus();
      }
    }
  };

  const handleVerifyOTP = () => {
    // Combine the OTP digits and perform verification here.
    const combinedOTP = otp.join('');
    console.log('OTP is:', combinedOTP);

    // Define the API endpoint URL for OTP verification
    const apiUrl = 'http://127.0.0.1:8000/verify_user_registration_otp'; // Replace with your backend API URL for OTP verification

    // Make a POST request to the backend to verify the OTP
    axios.post(apiUrl, { otp: combinedOTP }, {headers:{'Content-Type' : 'application/json'}, withCredentials : true })
      .then((response) => {
        // Handle the successful response here
        console.log('OTP verification successful:', response.data);
        // Redirect or perform any other action after successful verification
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Your account has been created and verified successfully. Please login to continue',
        }).then(() => {
          // Redirect to the home page upon successful verification
          navigate('/user/signin'); // Replace '/home' with the actual path to your home page
        });
      })
      .catch((error) => {
        // Handle any errors here
        Swal.fire({
          icon: 'error',
          title: 'Invalid OTP',
          text: 'Please enter correct OTP',
        })
        console.error('OTP verification failed:', error);
      });
  };

  const showPleaseWaitAlert = () => {
    setIsLoading(true);

    Swal.fire({
      icon: 'info',
      title: 'Please Wait',
      text: ' we are verifiying OTP',
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

  return (
    <>
      <Navbar />
      <div className="w-full max-w-sm mx-auto mt-20  p-6 border rounded-lg shadow-xl">
        <h2 className="text-2xl font-semibold mb-4">OTP Verification</h2>
        <p>Enter the OTP sent to your email or phone.</p>
        <div className="mb-4 flex justify-center">
          {otpFields.map((_, index) => (
            <input
              key={index}
              type="text"
              placeholder="0"
              value={otp[index]}
              onChange={(e) => handleOTPChange(e, index)}
              className="w-12 px-4 py-2 border rounded-lg text-center focus:outline-none focus:border-blue-400 mr-2"
              ref={otpInputRefs[index]}
              maxLength="1"
            />
          ))}
        </div>
        <div className="text-center">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
            onClick={handleVerifyOTP}
          >
            Verify OTP
          </button>
        </div>
      </div>
      <div className="hidden md:block w-1/3 absolute bottom-0 right-0">
        <img src={logo} alt="" />
      </div>
    </>
  );
};

export default OTPVerification;
