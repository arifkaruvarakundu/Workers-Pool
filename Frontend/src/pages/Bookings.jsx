import React, { useState, useEffect } from 'react';
import AxiosInstance from './../../axios_instance';

function Bookings() {
  const [appointments, setAppointments] = useState([]);
  const [statusChoices, setStatusChoices] = useState([]);
  const axios = AxiosInstance();

  useEffect(() => {
    // Fetch appointments and status choices from your Django backend using Axios
    axios.get('all_appointments/')
      .then(response => {
        console.log(response.data);
        setAppointments(response.data);
      })
      .catch(error => console.error('Error fetching appointments:', error));

    axios.get('appointment_status_choices/')
      .then(response => {
        console.log(response.data);
        setStatusChoices(response.data);
      })
      .catch(error => console.error('Error fetching status choices:', error));
  }, []);

  const handleStatusChange = (appointmentId, newStatus) => {
    
    axios.put(`assign_appointment_status/${appointmentId}`, { status: newStatus })
      .then(response => {
        console.log(response.data);
        // Refresh the appointments after updating the status
        axios.get('all_appointments/')
          .then(response => {
            setAppointments(response.data);
          })
          .catch(error => console.error('Error fetching appointments:', error));
      })
      .catch(error => console.error('Error updating status:', error));
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">All Appointments</h2>
      <ul className="list-disc">
        {appointments.map(appointment => (
          <li key={appointment.id} className="mb-4 border p-4 rounded">
            <p className="text-lg font-semibold">Customer: {appointment.customer.username}</p>
            <p className="text-md">Service: {appointment.service ? appointment.service.Title : "No Service"}</p>
            <p className="text-md">Status: {appointment.status}</p>
            <p className="text-md">Date: {appointment.date1}</p>
            <p className="text-md">WorkerId: {appointment.worker}</p>
            <div className="mt-2">
              <p className="text-md font-semibold">Change Status:</p>
              {statusChoices.map(choice => (
                <label key={choice[0]} className="mr-4">
                  <input
                    type="radio"
                    name={`status_${appointment.id}`}
                    value={choice[0]}
                    checked={appointment.status === choice[0]}
                    onChange={() => handleStatusChange(appointment.id, choice[0])}
                  />
                  {choice[1]}
                </label>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Bookings;
