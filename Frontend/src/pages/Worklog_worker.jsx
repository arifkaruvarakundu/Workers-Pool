import React, { useState, useEffect } from 'react';
import AxiosInstance from '../../axios_instance';
import {useSelector,useDispatch } from 'react-redux';
import { setStatus } from '../Redux/statusSlice';
import { selectStatus } from '../Redux/statusSlice';

function Worklog_worker() {
  const [worklog, setWorklog] = useState([]);
  const [customerDetailsList, setCustomerDetailsList] = useState([]);
  
  const axios=AxiosInstance()
  const status = useSelector(selectStatus);


  useEffect(() => {
    const user_id = localStorage.getItem('user_id');
    console.log(user_id)

    const fetchBookingDetails = async () => {
      try {
        const response = await axios.get(`all_appointment_worker/${user_id}/`);
        console.log(response.data)
        if (response.data && response.data.length > 0) {
        
          response.data.forEach(item => {
           
            dispatch(setStatus(item.status));
          });
        } else {
          console.error('No data or unexpected data structure in the response.');
        }
        setWorklog(response.data);
        const customerDetailsPromises = response.data.map(async (item) => {
          const customerId = item.customer.id;
          const customerDetailsResponse = await axios.get(`userdetails/${customerId}/`);
          return customerDetailsResponse.data;
        });
        const allCustomerDetails = await Promise.all(customerDetailsPromises);
        setCustomerDetailsList(allCustomerDetails);
      } catch (error) {
        console.error('Error fetching Booking details', error);
      }
    };


    fetchBookingDetails();
  }, []); 

  
  const dispatch = useDispatch();


  const handleAccept = async (id) => {
    try {
      const response = await axios.put(`assign_appointment_status/${id}`, {
        status: 'Accepted',
      });
      dispatch(setStatus('Accepted'));
      console.log(response.data);
    } catch (error) {
      console.error('Error accepting appointment:', error);
    }
  };


  const handleReject = async (id) => {
    try {
      const response = await axios.put(`assign_appointment_status/${id}`, {
        status: 'Rejected',
      });
      dispatch(setStatus('Rejected'));
      fetchBookingDetails();
      console.log(response.data);
    } catch (error) {
      console.error('Error rejecting appointment:', error);
    }
  };

  const renderAction = (item) => {
    if (item.status === 'Cancelled') {
      return null;
    }
  
    if (item.status === 'Accepted' || item.status === 'Rejected') {
      return null;
    }
  
    return (
      <div>
        <button
          onClick={() => handleAccept(item.id)}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Accept
        </button>
  
        <button
          onClick={() => handleReject(item.id)}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Reject
        </button>
      </div>
    );
  };
  


  return (
    <div className="container mx-auto p-8">
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">No.</th>
            <th className="px-4 py-2">Service</th>
            <th className="px-4 py-2">Customer Details</th>
            <th className="px-4 py-2">Descritpion about work</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {worklog.map((item, index) => (
            <tr key={item.id} className={(index % 2 === 0) ? 'bg-gray-100' : ''}>
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{item.service.Title}</td>
              <td className="border px-4 py-2">
                {customerDetailsList[index] && (
                  `${customerDetailsList[index].first_name} ${customerDetailsList[index].last_name}, ${customerDetailsList[index].house_number}, ${customerDetailsList[index].street_name}, ${customerDetailsList[index].panchayath_municipality_corporation}, ${customerDetailsList[index].taluk}, ${customerDetailsList[index].district}, ${customerDetailsList[index].state}, ${customerDetailsList[index].mobile_number}, ${customerDetailsList[index].country}`
                )}
              </td>
              <td className="border px-4 py-2">{item.short_description}</td>
              <td className="border px-4 py-2">{item.date1}</td>
              <td className="border px-4 py-2">{status}</td>
              <td className="border px-4 py-2">{renderAction(item)}</td>
            </tr>))}
        </tbody>
      </table>
    </div>
  );
}

export default Worklog_worker;
