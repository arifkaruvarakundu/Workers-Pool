import React, { useState, useEffect } from 'react';
import AxiosInstance from '../../axios_instance';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams } from 'react-router-dom';
import BookingConfirmationModal from '../components/Bookingconfirmationmodal';
import { useSelector } from 'react-redux';
import { selectServiceId } from '../Redux/serviceSlice';
import { selectStatus } from '../Redux/statusSlice';

const BookAppointment = () => {
  const { workerId } = useParams();
  const [short_description, setShort_description] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [busyDates, setBusyDates] = useState([]);

  const axios = AxiosInstance();

  const status = useSelector(selectStatus);
  const serviceId = useSelector(selectServiceId);
  const user_id = localStorage.getItem('user_id');

  useEffect(() => {
    console.log('Service ID:', serviceId);
    console.log('User ID:', user_id);
  }, [serviceId, user_id]);

  const fetchBusyDates = async () => {
    try {
      const response = await axios.get(`get_busy_dates/${workerId}`);
      setBusyDates(response.data.busyDates);
    } catch (error) {
      console.error('Error fetching busy dates:', error);
    }
  };

  useEffect(() => {
    fetchBusyDates();
  }, [workerId]);

  const isDateBusy = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    return busyDates.includes(formattedDate);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('short_description', short_description);
    const formattedDate = selectedDate.toISOString().split('T')[0];
    formData.append('selectedDate', formattedDate);
    formData.append('user_id', user_id);
    formData.append('serviceId', serviceId);
    formData.append('workerId', workerId);
    formData.append('status', status);

    try {
      const response = await axios.post('book_appointment', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle the response as needed
      console.log(response.data);
      localStorage.setItem('appointment_id', response.data.appointment_id);

      // Show the confirmation modal
      setShowModal(true);
    } catch (error) {
      console.error('Error booking appointment', error);
      // Handle errors if needed
    }
  };

  const CustomDatePickerInput = ({ value, onClick }) => {
    const date = new Date(value);
    const isDisabled = isDateBusy(date);

    return (
      <div>
        <input
          type="text"
          value={value}
          onClick={onClick}
          className={`w-full p-2 border rounded-lg ${isDisabled ? 'bg-red-500 text-white' : ''}`}
          disabled={isDisabled}
        />
        {isDisabled && <p className="text-red-500">This date is not available. Please choose another date.</p>}
      </div>
    );
  };

  const handleConfirmBooking = (paymentConfirmed) => {
    if (paymentConfirmed) {
      // Handle the payment confirmation and status update here
      // You can make an API call to update the booking status to "Pending"
      // For example, using axios.post('http://localhost:8000/update_status', { status: 'Pending', workerId, bookingId })
    }
    setShowModal(false);
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
              onChange={(date) => setSelectedDate(date)}
              className="w-full p-2 border rounded-lg"
              customInput={<CustomDatePickerInput />}
              filterDate={(date) => !isDateBusy(date)}
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
      </div>
      <BookingConfirmationModal show={showModal} onClose={() => setShowModal(false)} onConfirm={handleConfirmBooking} />
    </div>
  );
};

export default BookAppointment;
