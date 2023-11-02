import React from 'react';
import Banner2 from '../assets/Banner2.webp'

function Banner_services() {
  return (
    <div className="relative bg-gray-900">
      {/* Replace with the path to your banner image in the assets folder */}
      <img
        src={Banner2}
        alt="Banner Image"
        className="w-full h-64 object-cover"
      />
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-3xl font-extrabold">Services</h1>
          <p className="text-lg"></p>
        </div>
      </div>
    </div>
  );
}

export default Banner_services;
