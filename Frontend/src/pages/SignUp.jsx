import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import AxiosInstance from '../../axios_instance';

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
  const axios=AxiosInstance()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    showPleaseWaitAlert();

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Password Mismatch',
        text: 'Passwords do not match. Please check your input.',
      });
      return;
    }

    axios
      .post('signup/', formData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      })
      .then((response) => {
        console.log('Registration successful:', response.data);
        const email = formData.email;
        closePleaseWaitAlert();
        showSuccessAlert(email);
        navigate('/OTPVerification');
      })
      .catch((error) => {
        console.error('Registration failed:', error);
        closePleaseWaitAlert();
        let errorMessage = 'Registration failed. Please try again later.';

        if (error.response && error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        }

        showErrorAlert(errorMessage);
      });
  };

  const showPleaseWaitAlert = () => {
    setIsLoading(true);

    Swal.fire({
      icon: 'info',
      title: 'Please Wait',
      text: 'We are verifying your details',
      allowOutsideClick: false,
      showConfirmButton: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      },
    });
  };

  const closePleaseWaitAlert = () => {
    setIsLoading(false);
    Swal.close();
  };

  const showSuccessAlert = (email) => {
    Swal.fire({
      icon: 'success',
      title: 'Enter your OTP',
      text: `OTP sent to your ${email} successfully.`,
    });
  };

  const showErrorAlert = (errorMessage) => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: errorMessage,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-200 to-indigo-500 flex justify-center items-center">
      <div className="p-4 bg-white rounded-lg shadow-lg flex flex-col justify-center items-center w-[35%]">
        <h2 className="text-2xl font-bold mb-4 bg-gray-200 py-2 px-4 rounded-tl-lg rounded-tr-lg">
          Sign Up
        </h2>
        <form className="space-y-4 w-full px-10">
          <div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <input
              type="email"
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
          <div>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
              Select Your Role
            </label>
            <select
              className="w-full p-2 border rounded-lg"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="worker">Worker</option>
            </select>
          </div>
          <div className="flex justify-center py-3">
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Sign Up
            </button>
          </div>
        </form>
        <p className="text-center py-5">
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
