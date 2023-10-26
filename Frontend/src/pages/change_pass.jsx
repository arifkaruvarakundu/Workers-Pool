import React from 'react';
import Modal from 'react-modal';
import { useSelector, useDispatch } from 'react-redux';
import { setNewPassword, setConfirmPassword } from '../Redux/passwordSlice';
import axios from 'axios';

const ChangePasswordModal = ({ isOpen, onRequestClose }) => {
  
  const newPassword = useSelector((state) => state.password.newPassword);
  const confirmPassword = useSelector((state) => state.password.confirmPassword);
  const dispatch = useDispatch();

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      maxWidth: '500px', 
    },
  };

  const tokenValue=localStorage.getItem("access")

  const handleSave = () => {
    if (newPassword === confirmPassword) {
      
      axios
          .post(
            'http://127.0.0.1:8000/update_password/', 
            { new_password: newPassword },
            {
              headers: {
                'Authorization': `Bearer ${tokenValue}`,
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
      <div className="mb-4">
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => dispatch(setNewPassword(e.target.value))}
          className="w-full p-2 border rounded-lg"
        />
      </div>
      <div className="mb-4">
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => dispatch(setConfirmPassword(e.target.value))}
          className="w-full p-2 border rounded-lg"
        />
      </div>
      <div className="flex justify-center">
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
    </div>
  </Modal>
  );
};

export default ChangePasswordModal;


