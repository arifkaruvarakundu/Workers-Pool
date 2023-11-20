import React from 'react';
import { useState } from 'react';
import AxiosInstance from '../../axios_instance';

const PaymentComponent = () => {

  const axios=AxiosInstance()
  const handlePayment = async () => {
    try {
      // Make a POST request to your Django backend to initiate the checkout session
      const response = await axios.post('checkout/');
      const sessionId = response.data.session_id;
      // Redirect to the Stripe checkout page using the URL from the response
      console.log(response.data.url)
      window.location.href = `${response.data.url}&session_id=${sessionId}`;
    } catch (error) {
      console.error('Error initiating checkout:', error);
    }
  };

  return (
    <div>
      <h1>Payment Component</h1>
      <button onClick={handlePayment}>Proceed to Payment</button>
    </div>
  );
};

export default PaymentComponent;
