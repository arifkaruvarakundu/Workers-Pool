import React from 'react';
import BannerImage from '../assets/BannerImage.jpg'

function Banner() {
  return (
    <div className="relative bg-gray-900">
      {/* Replace with the path to your banner image in the assets folder */}
      <img
        src={BannerImage}
        alt="Banner Image"
        className="w-full h-64 object-cover"
      />
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-3xl font-extrabold">Welcome to Workers Pool</h1>
          <p className="text-lg"></p>
        </div>
      </div>
    </div>
  );
}

export default Banner;
