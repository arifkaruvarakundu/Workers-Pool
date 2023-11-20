import React, { useEffect, useState } from 'react';
import AxiosInstance from '../../axios_instance';
import { useParams } from 'react-router-dom';

function Banner_workers() {
  const { serviceId } = useParams();
  const axios = AxiosInstance();
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('services/', {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Check if response.data has a 'results' property
        const servicesArray = response.data.results || [];

        // Find the service with the matching id
        const service = servicesArray.find(service => service.id === parseInt(serviceId));

        // Set the selectedService in state
        setSelectedService(service);
      } catch (error) {
        console.error('Error fetching services', error);
      }
    };

    fetchServices();
  }, [serviceId]);

  // If selectedService is still null, show a loading message
  if (!selectedService) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative bg-gray-900">
      {/* Use the 'service_img' of the selected service as the image source */}
      <img
        src={selectedService.service_img}
        alt="Service Image"
        className="w-full h-64 object-cover"
      />
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-3xl font-extrabold">{selectedService.Title}</h1>
          <p className="text-lg">{selectedService.description}</p>
        </div>
      </div>
    </div>
  );
}

export default Banner_workers;
