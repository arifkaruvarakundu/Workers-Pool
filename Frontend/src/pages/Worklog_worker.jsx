import React, { useState, useEffect } from 'react';
import AxiosInstance from '../../axios_instance';

function Worklog_worker() {
  const [worklog, setWorklog] = useState([]);
  const [customerDetailsList, setCustomerDetailsList] = useState([]);
  const [userId,setUserId]=useState('')
  const axios = AxiosInstance();
  

  const fetchBookingDetails = async () => {
    try {
      const response = await axios.get(`all_appointment_worker/${localStorage.getItem('user_id')}/`);
      console.log(response.data);
      if (response.data && response.data.length > 0) {
        setWorklog(response.data);
        const customerDetailsPromises = response.data.map(async (item) => {
          const customerId = item.customer.id;
          setUserId(customerId)
          const customerDetailsResponse = await axios.get(`userdetails/${customerId}/`);
          console.log('customerDetails....', customerDetailsResponse);
          return customerDetailsResponse.data;
        });
        const allCustomerDetails = await Promise.all(customerDetailsPromises);
        console.log("customer details hello", allCustomerDetails)
        setCustomerDetailsList(allCustomerDetails);
      } else {
        console.error('No data or unexpected data structure in the response.');
      }
    } catch (error) {
      console.error('Error fetching Booking details', error);
    }
  };

  useEffect(() => {
    fetchBookingDetails();
  }, []);

  const handleAccept = async (id) => {
    try {
      await axios.put(`assign_appointment_status/${id}`, {
        status: 'Accepted',
      });

      // Update the status for the specific booking
      const updatedWorklog = worklog.map((item) =>
        item.id === id ? { ...item, status: 'Accepted' } : item
      );
      setWorklog(updatedWorklog);

      console.log("Accepted");
    } catch (error) {
      console.error('Error accepting appointment:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      // Update the status for the specific booking
      const updatedWorklog = worklog.map((item) =>
        item.id === id ? { ...item, status: 'Rejected' } : item
      );
      setWorklog(updatedWorklog);
  
      // Reject the appointment
      await axios.put(`assign_appointment_status/${id}`, {
        status: 'Rejected',
      });
  
      console.log("Rejected");
  
      // Get the user_id from the current appointment or wherever it's available
      // Adjust this based on your data structure
  
      // Debit Rs.50 from AdminWallet and credit it to UserWallet
      const transferCreditResponse = await axios.get(`transfer_credit/${userId}/`);
  
      if (transferCreditResponse.data.success) {
        console.log(transferCreditResponse.data.message);
      } else {
        console.error(transferCreditResponse.data.message);
      }
    } catch (error) {
      console.error('Error rejecting appointment:', error);
    }
  };
  
  const renderAction = (item) => {
    if (item.status === 'Cancelled' || item.status === 'Accepted' || item.status === 'Rejected') {
      return null;
    }

    const isPending = item.status === 'Pending';

    const handleAcceptClick = () => {
      handleAccept(item.id);
    };

    const handleRejectClick = () => {
      handleReject(item.id);
    };

    return (
      <div>
        {isPending && (
          <>
            <button
              onClick={handleAcceptClick}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Accept
            </button>

            <button
              onClick={handleRejectClick}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Reject
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-8">
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">No.</th>
            <th className="px-4 py-2">Booking ID</th>
            <th className="px-4 py-2">Service</th>
            <th className="px-4 py-2">Customer Details</th>
            <th className="px-4 py-2">Description about work</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {worklog.map((item, index) => (
            <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="borker px-4 py-2">{item.id}</td>
              <td className="border px-4 py-2">{item.service.Title}</td>
              <td className="border px-4 py-2">
                {customerDetailsList[index] ? (
                  <>
                    {customerDetailsList[index].first_name} {customerDetailsList[index].last_name}, {customerDetailsList[index].house_number}, {customerDetailsList[index].street_name}, {customerDetailsList[index].panchayath_municipality_corporation}, {customerDetailsList[index].taluk}, {customerDetailsList[index].district}, {customerDetailsList[index].state}, {customerDetailsList[index].mobile_number}, {customerDetailsList[index].country}
                  </>
                ) : (
                  'Customer details not available'
                )}
              </td>
              <td className="border px-4 py-2">{item.short_description}</td>
              <td className="border px-4 py-2">{item.date1}</td>
              <td className="border px-4 py-2">{item.status}</td>
              <td className="border px-4 py-2">{renderAction(item)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Worklog_worker;
