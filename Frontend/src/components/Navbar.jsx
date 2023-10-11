import React from 'react';
import logo from '../assets/logo.png';

function Navbar() {
  return (
    <div className="bg-gray-800 p-4 w-full">
      <div className="container">
        <div className="flex justify-between items-center">
          <img src={logo} alt="Logo" className="w-16 h-16" />
          <ul className="flex space-x-4 ml-auto"> {/* Apply ml-auto here */}
            <li className="text-white">
              <a href="#" className="hover:text-gray-300">Home</a>
            </li>
            <li className="text-white">
              <a href="#" className="hover:text-gray-300">About</a>
            </li>
            <li className="text-white">
              <a href="#" className="hover:text-gray-300">Services</a>
            </li>
            <li className="text-white">
              <a href="#" className="hover:text-gray-300">Contact</a>
            </li>
          </ul>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            SignUp/SignIn
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
