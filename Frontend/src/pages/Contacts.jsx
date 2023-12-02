import React from 'react';

function Contacts() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
      <p className="text-gray-700 leading-relaxed">
        Have questions or suggestions? Reach out to us! Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Nulla facilisi. Sed vel ex vel elit tempor facilisis. Proin consectetur lacinia mi, nec luctus turpis
        tristique in. Suspendisse potenti. Curabitur et tortor nec nulla fermentum volutpat eu id libero.
      </p>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
        <p className="text-gray-700">
          <span className="font-bold">Email:</span> harifn786@gmail.com
        </p>
        <p className="text-gray-700">
          <span className="font-bold">Phone:</span> +91 9745 674 674
        </p>
        <p className="text-gray-700">
          <span className="font-bold">Address:</span> Iringattiri, Karuvarakundu(P.O),Malappuram, Kerala, India
        </p>
      </div>

      {/* <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              MUHAMMED HARIF N
            </label>
            <input
              className="border border-gray-300 p-2 w-full rounded-md"
              type="text"
              id="name"
              name="name"
              placeholder="John Doe"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Your Email
            </label>
            <input
              className="border border-gray-300 p-2 w-full rounded-md"
              type="email"
              id="email"
              name="email"
              placeholder="john.doe@example.com"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
              Your Message
            </label>
            <textarea
              className="border border-gray-300 p-2 w-full rounded-md"
              id="message"
              name="message"
              rows="4"
              placeholder="Write your message here..."
            />
          </div>

          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
            type="submit"
          >
            Send Message
          </button>
        </form>
      </div> */}
    </div>
  );
}

export default Contacts;
