import Navbar from '../components/Navbar/Navbar';
import Banner from '../components/Banner';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
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
        setServices(response.data.results.slice(0, 6)); // Display the first six services
      } catch (error) {
        console.error('Error fetching services', error);
      }
    };

    fetchServices();
  }, []);

  return (
    <div>
      <div>
        <Navbar/>

        <Banner />

      </div>
       <div className="flex items-center justify-center pt-5">
         <h1 className="text-2xl font-bold mb-4 py-5 underline">Services</h1>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.map((service) => (
            <Link
              key={service.id}
              to={`/service/${service.id}`}
              className="rounded-lg p-4 shadow-md border border-gray-200 hover:shadow-lg hover:bg-gray-500 flex flex-col items-center justify-center"
            >
              <img
                src={service.service_img}
                alt={service.Title}
                className="w-32 h-32 object-cover rounded-full mb-4"
              />
              <h2 className="text-xl font-semibold">{service.Title}</h2>
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-center mt-4 py-10">
          <Link to="/services" className="text-blue-500 hover:underline font-bold">
           Show More
          </Link>
        </div>
    </div>
  );
}

export default Home;
