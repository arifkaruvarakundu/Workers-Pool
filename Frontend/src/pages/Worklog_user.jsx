import React, { useState, useEffect } from 'react';
import AxiosInstance from '../../axios_instance';

function Worklog_user() {
  const [worklog, setWorklog] = useState([]);
  const [workerDetails, setWorkerDetails] = useState({});
  const [userRole, setUserRole] = useState('');

  const axios = AxiosInstance();

  useEffect(() => {
    console.log(workerDetails);
  }, [workerDetails]);

  useEffect(() => {
    const user_id = localStorage.getItem('user_id');
    const storedUserRole = localStorage.getItem('user_role');
    setUserRole(storedUserRole);

    const fetchBookingDetails = async () => {
      try {
        const response = await axios.get(`all_appointment_user/${user_id}/`);
        const appointments = response.data;
        console.log(appointments);

        const workerPromises = appointments.map(async (appointment) => {
          const worker_id = appointment.worker;
          console.log(worker_id);

          try {
            const workerResponse = await axios.get(`userdetails/${worker_id}/`);
            console.log(workerResponse.data);
            setWorkerDetails((prevDetails) => ({
              ...prevDetails,
              [worker_id]: workerResponse.data,
            }));
            console.log(workerDetails);
          } catch (workerError) {
            console.error('Error fetching worker details', workerError);
          }
        });

        await Promise.all(workerPromises);

        setWorklog(appointments);
        console.log(worklog);
      } catch (error) {
        console.error('Error fetching Booking details', error);
      }
    };

    fetchBookingDetails();
  }, []);

  const handleCancel = async (id) => {
    try {
      const response = await axios.put(`assign_appointment_status/${id}`, {
        status: 'Cancelled',
      });

      // Update the status for the specific booking
      const updatedWorklog = worklog.map((item) =>
        item.id === id ? { ...item, status: 'Cancelled' } : item
      );
      setWorklog(updatedWorklog);

      console.log(response.data);
    } catch (error) {
      console.error('Error updating appointment status', error);
    }
  };

  const renderAction = (item) => {
    if (item.status === 'Accepted' || item.status === 'Rejected' || item.status === 'Cancelled') {
      return null;
    }
    return (
      <div>
        <button
          onClick={() => handleCancel(item.id)}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Cancel
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
            <th className="px-4 py-2">Booking ID</th>
            <th className="px-4 py-2">Service</th>
            {userRole === 'user' ? (
              <th className="px-4 py-2">Worker Details</th>
            ) : (
              <th className="px-4 py-2">{userRole === 'worker' ? 'Customer' : 'Customer'}</th>
            )}
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {worklog.map((item, index) => (
            <tr key={item.id} className={(index % 2 === 0) ? 'bg-gray-100' : ''}>
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{item.id}</td>
              <td className="border px-4 py-2">{item.service.Title}</td>
              <td className="border px-4 py-2">
                {`${workerDetails[item.worker]?.first_name ?? ''} ${workerDetails[item.worker]?.last_name ?? ''}, ${workerDetails[item.worker]?.house_number ?? ''}, ${workerDetails[item.worker]?.street_name ?? ''}, ${workerDetails[item.worker]?.panchayath ?? ''}, ${workerDetails[item.worker]?.taluk ?? ''}, ${workerDetails[item.worker]?.district ?? ''}, ${workerDetails[item.worker]?.state ?? ''}, ${workerDetails[item.worker]?.mobile_number ?? ''}, ${workerDetails[item.worker]?.country ?? ''}`}
              </td>
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

export default Worklog_user;
