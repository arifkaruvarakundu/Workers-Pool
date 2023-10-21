import React from 'react';
import { Link } from 'react-router-dom';
import plumberImage from '../assets/plumber_04.jpg';
import electricianImage from '../assets/electrician.jpg';
import painterImage from '../assets/painter.jpg';

function Services() {
  // Sample list of services
  const services = [
    {
      title: 'Plumbing',
      icon: plumberImage,
      link: '/plumbing', // Define the link for each service
    },
    {
      title: 'Electrician',
      icon: electricianImage,
      link: '/electrician',
    },
    {
      title: 'Painter',
      icon: painterImage,
      link: '/painter',
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-semibold text-center mb-8">Our Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div key={index} className="bg-white rounded p-4 shadow-2xl">
            <Link to={service.link}>
              <img
                src={service.icon}
                alt={service.title}
                className="w-32 h-32 mx-auto mb-2" // Increase width and height for larger images
              />
              <h3 className="text-xl font-semibold text-center mb-2">
                {service.title}
              </h3>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Services;
