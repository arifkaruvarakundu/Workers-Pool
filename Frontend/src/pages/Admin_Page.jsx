import React from 'react';
import { Link } from 'react-router-dom';

function Admin_Page() {
  return (
    <div className="flex h-full">
      {/* Left Side Navbar */}
      <div className="w-1/5 bg-gray-800 text-white">
        <ul className="p-4">
          <li className="mb-4">
            <Link to="/dashboard" className="block text-blue-400 hover:text-blue-200">
              Dashboard
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/users_workers" className="block text-blue-400 hover:text-blue-200">
              Users
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/workers" className="block text-blue-400 hover:text-blue-200">
              Workers
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/service_management" className="block text-blue-400 hover:text-blue-200">
              Services
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/homepage" className="block text-blue-400 hover:text-blue-200">
              Homepage
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-4/5 p-4">
        {/* Your admin page content goes here */}
      </div>
    </div>
  );
}

export default Admin_Page;
