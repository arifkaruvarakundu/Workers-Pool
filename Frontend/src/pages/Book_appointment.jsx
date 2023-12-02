import React, { useState, useEffect } from 'react';
import AxiosInstance from '../../axios_instance';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams } from 'react-router-dom';
import BookingConfirmationModal from '../components/Bookingconfirmationmodal';
import { useSelector } from 'react-redux';
import { selectServiceId } from '../Redux/serviceSlice';
import { wserver } from './../../server';
import { ToastContainer, toast } from 'react-toastify';

const BookAppointment = () => {
  const { workerId } = useParams();
  const [short_description, setShort_description] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [busyDates, setBusyDates] = useState([]);
  const axios = AxiosInstance();

  const serviceId = useSelector(selectServiceId);
  const user_id = localStorage.getItem('user_id');
  const username= localStorage.getItem('username')

  useEffect(() => {
    console.log('Service ID:', serviceId);
    console.log('User ID:', user_id);
  }, [serviceId, user_id]);

  useEffect(() => {
    const fetchBusyDates = async () => {
      try {
        const response = await axios.get(`get_busy_dates/${workerId}`);
        console.log(response.data);
        setBusyDates(response.data.busyDates);
        console.log(busyDates)
      } catch (error) {
        console.error('Error fetching busy dates:', error);
      }
    };

    fetchBusyDates();
  }, [workerId]);
  
  const isDateBusy = (date) => busyDates.some(busyDate => {
    const formattedBusyDate = new Date(busyDate).toDateString();
    const formattedDate = date.toDateString();
    return formattedDate === formattedBusyDate;
  });


  const sendNotification = () => {
    const roomName = `${workerId}`;
    console.log(user_id);
    console.log(workerId);
    console.log(roomName);
    const client = new WebSocket(`ws://${wserver}/ws/notification/${roomName}/`);
  
    client.onopen = () => {
      console.log('WebSocket connection established');
      
      const message = {
        type: 'notification.message',
        text: username,
      };
  
      client.send(JSON.stringify(message));
      console.log(message);
  
      // Optionally, you can close the connection after sending the message
      // client.close();
    };
  
    client.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('short_description', short_description);
    console.log(selectedDate)
    const formattedDate = selectedDate.toLocaleDateString('en-GB');
    console.log(formattedDate);
    const year = selectedDate.getFullYear();
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = selectedDate.getDate().toString().padStart(2, '0');
    const formattedDate1 = `${year}-${month}-${day}`;
    console.log(formattedDate1);
    formData.append('selectedDate', formattedDate1);
    formData.append('user_id', user_id);
    formData.append('serviceId', serviceId);
    formData.append('workerId', workerId);
    // formData.append('status', status);

    try {
      const response = await axios.post('book_appointment', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      localStorage.setItem('appointment_id', response.data.appointment_id);
      setShowModal(true); 
      sendNotification();
      toast.success('You booked successfully',{
        autoClose: 5000,});
    } catch (error) {
      console.error('Error booking appointment', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-200 to-indigo-500 flex justify-center items-center">
      <div className="p-4 bg-white rounded-lg shadow-lg flex flex-col justify-center items-center w-[35%]">
        <h2 className="text-2xl font-bold mb-4 bg-gray-200 py-2 px-4 rounded-tl-lg rounded-tr-lg">
          Book an Appointment
        </h2>
        <form className="space-y-4 w-full px-10" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="shortdescription" className="block text-gray-700 text-sm font-bold mb-2">
              Short description about work
            </label>
            <input
              type="text"
              id="shortdescription"
              className="w-full p-2 border rounded-lg"
              value={short_description}
              onChange={(e) => setShort_description(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">
              Date
            </label>
            <DatePicker
                id="date"
                selected={selectedDate}
                onChange={(date) => 
                  setSelectedDate(date)
                }
                className="w-full p-2 border rounded-lg"
                excludeDates={busyDates.map(busyDate => new Date(busyDate))}
                minDate={new Date()}
                autoComplete="off"
                dateFormat="MM/dd/yyyy" 
                filterDate={date => !isDateBusy(date)} 
              />
          </div>
          <div className="flex justify-center py-3">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Book Appointment
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
      <BookingConfirmationModal show={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default BookAppointment;
