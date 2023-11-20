import React, { useState, useEffect } from 'react';
import AxiosInstance from '../../axios_instance';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';

function WorkerDetails() {
  const { workerId } = useParams();
  const [worker, setWorker] = useState(null);

  const axios=AxiosInstance()

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
              src={`http://127.0.0.1:8000${worker.user_id.profile_img}`}
              alt={`${worker.first_name} ${worker.last_name}`}
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
            <p className="text-gray-600 mb-2">Years of Experience: {worker.years_of_experience}</p>
            
            <div className="mt-4">
              <Link
                to={`/booking/${workerId}`}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
              >
                Booking
              </Link>
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
      </div>
    </div>
  );
}

export default WorkerDetails;
