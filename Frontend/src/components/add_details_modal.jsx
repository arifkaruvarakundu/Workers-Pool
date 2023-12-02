import React from 'react';
import { useNavigate } from 'react-router-dom';

function AddDetailsModal({ closeModal }) {
  const navigate = useNavigate();

  const navigateToAddDetails = () => {
    navigate('/add_details');
    closeModal();
  };

  

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Add Your Details To Complete Booking</h2>
        {/* Add your form components here to collect user details */}
        <div className="mt-4 flex justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={navigateToAddDetails}
          >
            Go to Add Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddDetailsModal;

