import React from 'react';
import { useState } from 'react';
import ChangePasswordModal from './change_pass';
  

const Profile_user = () => {

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleOpenPasswordModal = () => {
    setIsPasswordModalOpen(true);
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
  };

  const handleChangePassword = (newPassword) => {
    // Implement the logic to change the password here
    console.log('New Password:', newPassword);
  };


  return (
    <div className="bg-gradient-to-b from-blue-300 to-blue-600 h-screen p-4">
      <div className="max-w-md mx-auto bg-white p-4 rounded-lg shadow-lg">
        <div className="text-center">
          <img
            src="path_to_profile_picture.jpg"
            alt="Profile Picture"
            className="w-32 h-32 rounded-full mx-auto border-4 border-white shadow-lg"
          />
          <button className="mt-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-2">
            Change Profile Picture
          </button>
        </div>
        <div className="mt-4">
          <h1 className="text-2xl font-semibold text-center">John Doe</h1>
          <p className="text-gray-600 text-center">Worker</p>
        </div>
        <div className="mt-4 text-center">
            <button
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-2 mx-2"
            onClick={handleOpenPasswordModal}
          >
            Change Password
          </button>

          <ChangePasswordModal
            isOpen={isPasswordModalOpen}
            onRequestClose={handleClosePasswordModal}
            onChangePassword={handleChangePassword}
          />
          <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-2 mx-2">
            Edit Details & Address
          </button>
        </div>
        <div className="mt-4 text-center">
          <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-2 mx-2">
            Show Work Log
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-2 mx-2">
            Show Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile_user;
