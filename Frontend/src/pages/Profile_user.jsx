import React, { useState } from 'react';
import ChangePasswordModal from './change_pass';
import { useDispatch, useSelector } from 'react-redux';
import { openPasswordModal, closePasswordModal } from '../Redux/passwordModalSlice';
import AxiosInstance from '../../axios_instance';
import { Link } from 'react-router-dom';

const Profile_user = () => {
  const [image, setImage] = useState(null);
  const isChangePasswordModalOpen = useSelector((state) => state.passwordModal.isChangePasswordModalOpen);
  const dispatch = useDispatch();
  const axios=AxiosInstance()

  const workerId =localStorage.getItem('user_id')

  const handleOpenPasswordModal = () => {
    dispatch(openPasswordModal());
  };

  const handleClosePasswordModal = () => {
    dispatch(closePasswordModal());
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleImageUpload = async () => {
    const formData = new FormData();
    if (image) {
      const userId = JSON.parse(localStorage.getItem('user')).id;

      formData.append('profile_image', image);
      formData.append('user_id', userId);

      try {
        // Replace 'YOUR_BACKEND_URL' with the actual URL of your Django API endpoint for image upload.
        const response = await axios.post('upload_profile_pic/', formData, {
          headers: { 
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Image uploaded successfully:', response.data);
        // Optional: You can refresh the user's profile data to show the new profile picture.
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  
  const userRole = JSON.parse(localStorage.getItem('user')).user_role;

  return (
    <div className="bg-gradient-to-b from-blue-300 to-blue-600 min-h-screen p-4 flex items-center justify-center">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="text-center">
          <img
            alt="Profile Preview"
            width="200px"
            height="200px"
            src={image ? URL.createObjectURL(image) : ''}
            className="rounded-full mx-auto mb-4"
          />
          <input
            onChange={handleImageChange}
            type="file"
            className="block w-full mt-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-full py-2 my-4"
            onClick={handleImageUpload}
          >
            Upload Profile Picture
          </button>
        </div>
        <div className="mt-4 text-center">
          {/* <button
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-2 mx-2"
            onClick={handleOpenPasswordModal}
          >
            Change Password
          </button> */}

          <ChangePasswordModal isOpen={isChangePasswordModalOpen} onRequestClose={handleClosePasswordModal} />
          <Link to= "/add_details">
          <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-2 mx-2">
            Add/Edit Details & Address
          </button>
          </Link>
          <Link to="/user_wallet">
          <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-2 mx-2">
            Wallet
          </button>
        </Link>
        </div>
        <div className="mt-4 text-center">
        {userRole === 'worker' ? (
        <>
        <Link to="/worklog_worker">
          <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-2 mx-2">
            Show Work Log
          </button>
        </Link>
        <Link to={`/workerchat/${workerId}`}>
          <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-2 mx-2">
            Chat
          </button>
        </Link>
      </>
      ) : (
        <Link to="/worklog_user">
          <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-2 mx-2">
            Show Work Log
          </button>
        </Link>
      )}
          {/* {userRole === 'worker' && (
            <button className="bg-blue-500 hover-bg-blue-600 text-white rounded-full px-4 py-2 mx-2">
              Show Bookings
            </button>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default Profile_user;
