import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from React Router
import Navbar from '../components/Navbar/Navbar';
import Banner_services from '../components/Banner_services';

function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/services/', {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log(response.data);
        setServices(response.data.results);
      } catch (error) {
        console.error('Error fetching services', error);
      }
    };

    fetchServices();
  }, []);

  return (
    <div>
      <Navbar />
      <Banner_services />
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.map((service) => (
            <Link to={`/service/${service.id}`} key={service.id}> {/* Use Link for navigation */}
              <div className="rounded-lg p-4 shadow-md border border-gray-200 hover:shadow-lg hover:bg-gray-200 flex flex-col items-center justify-center">
                <img
                  src={service.service_img}
                  alt={service.Title}
                  className="w-32 h-32 object-cover rounded-full mb-4"
                />
                <h2 className="text-xl font-semibold">{service.Title}</h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Services;
