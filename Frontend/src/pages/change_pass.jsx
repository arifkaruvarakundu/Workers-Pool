import React, { useState } from 'react';
import Modal from 'react-modal';

const ChangePasswordModal = ({ isOpen, onRequestClose, onChangePassword }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const customStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          transform: 'translate(-50%, -50%)',
          maxWidth: '500px', // Adjust the maximum width as needed
        },
      };

      const handleSave = () => {
        if (newPassword === confirmPassword) {
          // Replace 'yourJwtToken' with your actual JWT token
          const token = 'yourJwtToken';
          const apiUrl = '/api/updatePassword/';
    
          axios
            .post(
              apiUrl,
              { new_password: newPassword },
              {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              }
            )
            .then((response) => {
              if (response.status === 200) {
                console.log('Password updated successfully');
              } else {
                console.error('Failed to update password');
              }
            })
            .catch((error) => {
              console.error(error);
            });
        } else {
          // Handle the case where passwords do not match
          alert('Passwords do not match.');
        }
      };
  
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        style={customStyles}
        contentLabel="Change Password Modal"
      >
        <div className="p-4 text-center">
          <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border rounded-lg mb-4"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border rounded-lg mb-4"
          />
          <button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-2 mx-2"
          >
            Save
          </button>
          <button
            onClick={onRequestClose}
            className="bg-gray-300 text-gray-600 hover:bg-gray-400 rounded-full px-4 py-2 mx-2"
          >
            Cancel
          </button>
        </div>
      </Modal>
    );
  };
  

export default ChangePasswordModal;
