import React from 'react';

function About() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">About Us</h1>
      <p className="text-gray-700 leading-relaxed">
        Welcome to our website! Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi.
        Sed vel ex vel elit tempor facilisis. Proin consectetur lacinia mi, nec luctus turpis tristique in.
        Suspendisse potenti. Curabitur et tortor nec nulla fermentum volutpat eu id libero.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Our Mission</h2>
      <p className="text-gray-700 leading-relaxed">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed vel ex vel elit tempor facilisis.
        Proin consectetur lacinia mi, nec luctus turpis tristique in. Suspendisse potenti. Curabitur et tortor nec nulla
        fermentum volutpat eu id libero.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Our Team</h2>
      <div className="flex space-x-4">
        <div className="flex-shrink-0">
          <img
            src="https://placekitten.com/100/100"
            alt="Team Member 1"
            className="rounded-full w-16 h-16"
          />
        </div>
        <div>
          <p className="font-bold">John Doe</p>
          <p className="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
      </div>

      <div className="flex space-x-4 mt-4">
        <div className="flex-shrink-0">
          <img
            src="https://placekitten.com/100/101"
            alt="Team Member 2"
            className="rounded-full w-16 h-16"
          />
        </div>
        <div>
          <p className="font-bold">Jane Doe</p>
          <p className="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
      </div>
    </div>
  );
}

export default About;

