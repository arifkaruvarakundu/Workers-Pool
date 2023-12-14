import React, { useState,useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// import WebSocketService from './../pages/WebsocketService';
// import { wserver } from './../../server'
import AxiosInstance from './../../axios_instance';
import { ToastContainer, toast } from 'react-toastify';


const BookingConfirmationModal = ({ show, onClose, onConfirm }) => {
  const appointmentId = localStorage.getItem('appointment_id');
  const userId=localStorage.getItem('user_id')
  const workerId=localStorage.getItem('workerId')
  // const [socketService, setSocketService] = useState(null);
  const [userWallet, setUserWallet] = useState(null);
  const axios = AxiosInstance();
  const [sufficientBalance, setSufficientBalance] = useState(false);
  // const navigate = useNavigate();


  
  const workerUsername=localStorage.getItem('worker_username')


  useEffect(() => {
    // Fetch user's wallet details when the component mounts
    const fetchUserWallet = async () => {
      try {
        const response = await axios.get(`user_wallet_details/${userId}/`);
        setUserWallet(response.data);
        setSufficientBalance(response.data.balance >= 50);

      } catch (error) {
        console.error('Error fetching user wallet details:', error);
      }
    };

    fetchUserWallet();
  }, [userId]);

  const handleUseWallet = async () => {
    try {
      
      if (userWallet && userWallet.balance >= 50) {
        
        const updateWalletResponse = await axios.patch(`transfer_credit_back/${userId}/`, {
          amount: 50,
        });
  
        if (updateWalletResponse.data.success) {
          console.log('Transaction successful.');
          toast.success('Your payment is successful, check your wallet balance..',{
            autoClose: 3000,});

          // navigate(`/user_wallet`);
  
        } else {
          console.error('Error processing wallet transaction:', updateWalletResponse.data.message);
        }
      } else {
        console.log('User does not have a wallet or insufficient balance.');
      }
    } catch (error) {
      console.error('Error handling wallet transaction:', error);
    }
  };
  
  

  const handlePayment = async () => {
    try {
      // Make a POST request to your Django backend to initiate the checkout session
      const response = await axios.post('checkout/',{
        appointment_id: appointmentId,
        user_id : userId,
        worker_id :workerId,
        workerUsername :workerUsername,
      });
      const sessionId = response.data.session_id;
      // Redirect to the Stripe checkout page using the URL from the response
      console.log(response.data.url)
      window.location.href = `${response.data.url}`;
      // sendNotificationToWorker()
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
          <p className="text-red-500 flex items-center justify-center mb-4">Please make Rs:50/- payment to confirm your booking.</p>
        <div className="flex justify-center">
            <button
              onClick={handlePayment}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md mt-4 mr-2"
            >
              Make Payment
            </button>
          {sufficientBalance && (
            <button
              onClick={handleUseWallet}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md mt-4"
            >
              Use Wallet
            </button>
          )}
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default BookingConfirmationModal;
