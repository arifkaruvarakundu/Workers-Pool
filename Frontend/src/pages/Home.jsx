
import React from 'react';
import Navbar from '../components/Navbar/Navbar';

function Home({ isAuthenticated, userRole }) {
  return (
    <div>
      <Navbar isAuthenticated={isAuthenticated} userRole={userRole} />
      {/* Additional content based on userRole */}
      {isAuthenticated && (
        <div>
          <h1>Welcome, {userRole}!</h1>
          {/* Add content specific to each role here */}
        </div>
      )}
    </div>
  );
}

export default Home;