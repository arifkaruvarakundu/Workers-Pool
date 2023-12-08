import React, { useState, useEffect } from 'react';
import AxiosInstance from '../../axios_instance';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Banner_workers from '../components/Banner_workers';
import { useDispatch } from 'react-redux';
import { setServiceId } from '../Redux/serviceSlice';


function ServiceWorkers() {
  const [workers, setWorkers] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceImage, setServiceImage] = useState(null);
  const [users, setUsers] = useState([]);
  const { serviceId } = useParams();
  const dispatch = useDispatch();
  const axios=AxiosInstance()

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await axios.get(`service/${serviceId}/workers`);
        console.log(response.data)
        setWorkers(response.data);
      } catch (error) {
        console.error('Error fetching workers for the service', error);
      }
    };

    fetchWorkers();
  }, [serviceId]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('services/', {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setServices(response.data.results);
        const selectedService = services.find((service) => service.id === serviceId);
        if (selectedService) {
          setServiceImage(selectedService.service_img);
        }
      } catch (error) {
        console.error('Error fetching services', error);
      }
    };

    fetchServices();
  }, [serviceId]);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('users/', {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log(response.data);
        setUsers(response.data.results);
      } catch (error) {
        console.error('Error fetching users', error);
        
      }
    };

    fetchUsers(); 
  }, []); 

  useEffect(() => {
    dispatch(setServiceId(serviceId));
  }, [dispatch, serviceId]);


  return (
    <div>
      <Navbar />
      <Banner_workers serviceImg={serviceImage} />

      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4"></h2>

        <div className="flex flex-wrap -mx-4">
          {workers.map((worker,index) => (
            <div key={worker.user_id||index} className="w-1/3 px-4 mb-4">
              <Link to={`/worker/${worker.user_id.id}`}>
                <div className="border p-4 rounded shadow-md hover:shadow-lg cursor-pointer">
                  <div className="flex items-center">
                    {worker.user_id.profile_img && (
                      <img
                        // src={`http://127.0.0.1:8000${worker.user_id.profile_img}`}
                        src={worker.user_id.profile_img.replace(
                          'http://0.0.0.0:9090',
                          'https://workerspool.online'
                        )}
                        alt={`${worker.first_name} ${worker.last_name}`}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                    )}
                    <div>
                      <h3 className="text-xl font-semibold">
                        {worker.first_name} {worker.last_name}
                      </h3>
                      <p className="text-gray-600">Mobile Number: {worker.mobile_number}</p>
                      {/* Add more worker details here */}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ServiceWorkers;
