import React, { useState, useEffect } from 'react';
import AxiosInstance from '../../axios_instance';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import AddDetailsModal from './../components/add_details_modal';

function WorkerDetails() {
  const { workerId } = useParams();
  const [worker, setWorker] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const axios=AxiosInstance()
  const userId=localStorage.getItem('user_id')
  const navigate=useNavigate();

  useEffect(() => {
    const fetchWorkerDetails = async () => {
      try {
        const response = await axios.get(`worker/${workerId}`);
        setWorker(response.data);

        // Set worker_username and workerId in localStorage
        localStorage.setItem('worker_username', response.data.user_id.username);
        localStorage.setItem('workerId', workerId);
      } catch (error) {
        console.error('Error fetching worker details', error);
      }
    };

    fetchWorkerDetails();
  }, [workerId]);

  const handleBookingClick = async () => {
    try {
      // Make a request to check if UserDetails is created for the user
      const response = await axios.get(`check_user_details/${userId}`); // Replace with your actual API endpoint
  
      if (response.data.userDetailsCreated) {
        // UserDetails exists, redirect to booking page
        navigate(`/booking/${workerId}`);
      } else {
        // UserDetails does not exist, show the modal
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error checking user details:', error);
    }
  };
  

  const closeModal = () => {
    setShowModal(false);
  };
  

  const navigateToAddDetails = () => {
    navigate('/add_details');
    closeModal(); 
  };

  return (
    <div className='h-screen'>
      <Navbar />
      <div className="h-4/6 w-3/4 mx-auto mt-8 p-4 bg-gradient-to-b from-blue-200 to-blue-400 flex flex-col justify-between">
        {worker ? (
          <div className="bg-white shadow-md p-4 rounded-lg text-center h-full">
            <h2 className="text-2xl font-bold mb-4">
              {worker.first_name} {worker.last_name}
            </h2>
            <img
              // src={`http://127.0.0.1:8000${worker.user_id.profile_img}`}
              src={worker.user_id.profile_img.replace(
                'http://0.0.0.0:9090',
                'https://workerspool.online'
              )}
              alt={`${worker.first_name} ${worker.last_name}`}
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
            <p className="text-gray-600 mb-2">Years of Experience: {worker.years_of_experience}</p>
            
            <div className="mt-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
                onClick={handleBookingClick}
              >
                Booking
              </button>
              <Link
                to={`/chat/${workerId}`}
                className="bg-green-500 hover-bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Chat
              </Link>
            </div>
          </div>
        ) : (
          <p>Loading worker details...</p>
        )}
        {showModal && (
          <AddDetailsModal closeModal={closeModal} navigateToAddDetails={navigateToAddDetails} />
        )}
      </div>
    </div>
  );
}

export default WorkerDetails;
