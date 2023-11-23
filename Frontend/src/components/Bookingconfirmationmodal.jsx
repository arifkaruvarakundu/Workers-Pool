import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';


const BookingConfirmationModal = ({ show, onClose, onConfirm }) => {
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const dispatch = useDispatch();
  
  const appointmentId = localStorage.getItem('appointment_id');
  const userId=localStorage.getItem('user_id')
  const workerId=localStorage.getItem('worker_id')
  const workerUsername=localStorage.getItem('worker_username')

  const handlePayment = async () => {
    try {
      // Make a POST request to your Django backend to initiate the checkout session
      const response = await axios.post('http://localhost:8000/checkout/',{
        appointment_id: appointmentId,
        user_id : userId,
        worker_id :workerId,
        workerUsername :workerUsername,
      });
      const sessionId = response.data.session_id;
      // Redirect to the Stripe checkout page using the URL from the response
      console.log(response.data.url)
      window.location.href = `${response.data.url}`;
      // &session_id=${sessionId}
      dispatch(setStatus('pending'));
      setPaymentConfirmed(true)

      
    } catch (error) {
      console.error('Error initiating checkout:', error);
    }
  };


  return (
    <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center ${show ? '' : 'hidden'}`}>
      <div className="bg-white p-6 pt-20 pb-20 rounded-lg shadow-md w-96 md:w-2/3 lg:w-1/2 mt-4">
      <div className="flex items-center justify-center mb-4">
          <h2 className="text-2xl font-bold text-blue-500">Booking Confirmation</h2>
        </div>
        <div className="flex items-center justify-center mb-4">
        <p className="text-gray-700"></p>
        </div>
        {paymentConfirmed ? (
          <p className="text-green-500 flex items-center justify-center mb-4">Payment is confirmed.</p>
        ) : (
          <p className="text-red-500 flex items-center justify-center mb-4">Please make Rs:50/- payment to confirm your booking.</p>
        )}
        <div className="flex justify-center">
          {!paymentConfirmed && (
            <button
              onClick={handlePayment}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md mt-4 mr-2"
            >
              Make Payment
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationModal;
