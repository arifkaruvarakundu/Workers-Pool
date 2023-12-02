import React, { useState, useEffect } from 'react';
import AxiosInstance from './../../axios_instance';

function UserWalletComponent() {
  const [walletDetails, setWalletDetails] = useState({});
  const axios = AxiosInstance();
  

  const fetchWalletDetails = async () => {
    try {
      const response = await axios.get(`user_wallet_details/${localStorage.getItem('user_id')}/`);
      console.log(response.data);
      setWalletDetails(response.data);
    } catch (error) {
      console.error('Error fetching wallet details', error);
    }
  };

  useEffect(() => {
    fetchWalletDetails();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-md mx-auto bg-white rounded-md overflow-hidden shadow-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Your Wallet</h2>
          <div className="mb-4">
            <p className="text-gray-600">Username: {walletDetails.user ? walletDetails.user.username : '-'}</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600">Balance: Rs. {walletDetails.balance}</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600">Created At: {walletDetails.created_at}</p>
          </div>
          {/* <div className="mb-4">
            <p className="text-gray-600">Total Credit: Rs. {walletDetails.credit}</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600">Total Debit: Rs. {walletDetails.debit}</p>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default UserWalletComponent;


