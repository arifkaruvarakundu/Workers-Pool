import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from "react-select";

function AddDetails() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    mobile_number: '',
    services: [],
    years_of_experience: '',
    license_certificate: null,
    min_charge: '',
    charge_after_one_hour: '',
    street_name: '',
    house_number: '',
    ward: '',
    panchayath_municipality_corporation: '',
    taluk: '',
    district: '',
    state: '',
    country: '',
  });

  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/services/')
      .then((response) => {
        setServices(response.data.results);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'services') {
      const selectedServices = Array.from(e.target.selectedOptions, (option) =>
        option.value
      );
      console.log('Selected Services:', selectedServices); 

      setFormData({
        ...formData,
        services: selectedServices,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const serviceOptions = services.map((service) => ({
    value: service.id,
    label: service.Title,
  }));

  const handleSelectChange = (selectedOptions) => {
    setSelectedServices(selectedOptions);
    const selectedServiceIds = selectedOptions.map((option) => option.value);
    setFormData({
      ...formData,
      services: selectedServiceIds,
    });
  };

  
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const fileContent = e.target.result;
        setFormData({
          ...formData,
          license_certificate: fileContent,
        });
        dataToSend.append('license_certificate', file);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const dataToSend = new FormData();
    dataToSend.append('first_name', formData.first_name);
    dataToSend.append('last_name', formData.last_name);
    dataToSend.append('mobile_number', formData.mobile_number);
    dataToSend.append('years_of_experience', formData.years_of_experience);
    dataToSend.append('min_charge', formData.min_charge);
    dataToSend.append('charge_after_one_hour', formData.charge_after_one_hour);
    dataToSend.append('street_name', formData.street_name);
    dataToSend.append('house_number', formData.house_number);
    dataToSend.append('ward', formData.ward);
    dataToSend.append('panchayath_municipality_corporation', formData.panchayath_municipality_corporation);
    dataToSend.append('taluk', formData.taluk);
    dataToSend.append('district', formData.district);
    dataToSend.append('state', formData.state);
    dataToSend.append('country', formData.country);
    formData.services.forEach((serviceId) => {
      dataToSend.append('services', serviceId);
    });
    if (formData.license_certificate) {
      dataToSend.append('license_certificate', formData.license_certificate);
    }
  
    try {
      const response = await axios.post('http://127.0.0.1:8000/add_details/', dataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('User details added successfully');
      toast.success('Submitted successfully');
    } catch (error) {
      console.error('Failed to add user details', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-200 to-indigo-500 flex justify-center items-center">
      <div className="p-4 bg-white rounded-lg shadow-lg flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold mb-4 bg-gray-200 py-2 px-4 rounded-tl-lg rounded-tr-lg">
          Add Details
        </h2>
      <form className="space-y-4">
        <div style={{ width: '75%' }}>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="First Name"
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div style={{ width: '75%' }}>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Last Name"
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div style={{ width: '75%' }}>
          <input
            type="text"
            name="mobile_number"
            value={formData.mobile_number}
            onChange={handleChange}
            placeholder="Mobile Number"
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div style={{ width: '75%' }}>
          <input
            type="text"
            name="years_of_experience"
            value={formData.years_of_experience}
            onChange={handleChange}
            placeholder="Years of experience"
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div style={{ width: '75%' }}>
        <Select
          name="services"
          value={selectedServices}
          onChange={handleSelectChange}
          options={serviceOptions}
          placeholder='Select your field of work'
          isMulti
        />
        </div>
        <div style={{ width: '75%' }}>
          <label htmlFor="license_certificate">License/Certificate:</label>
          <input
            type="file"
            id="license_certificate"
            name="license_certificate"
            accept=".pdf, .doc, .docx"
            onChange={handleFileChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div style={{ width: '75%' }}>
          <input
            type="text"
            name="min_charge"
            value={formData.min_charge}
            onChange={handleChange}
            placeholder="Min.charge(for first 1 hour)"
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div style={{ width: '75%' }}>
          <input
            type="text"
            name="charge_after_one_hour"
            value={formData.charge_after_one_hour}
            onChange={handleChange}
            placeholder="Charge after one hour"
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <strong style={{ textDecoration: 'underline' }}>Address</strong>
        <div style={{ width: '75%' }}>
          <input
            type="text"
            name="street_name"
            value={formData.street_name}
            onChange={handleChange}
            placeholder="Street name"
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div style={{ width: '75%' }}>
          <input
            type="text"
            name="house_number"
            value={formData.house_number}
            onChange={handleChange}
            placeholder="House No."
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div style={{ width: '75%' }}>
          <input
            type="text"
            name="ward"
            value={formData.ward}
            onChange={handleChange}
            placeholder="Ward No."
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div style={{ width: '75%' }}>
          <input
            type="text"
            name="panchayath_municipality_corporation"
            value={formData.panchayath_municipality_corporation}
            onChange={handleChange}
            placeholder="Panchayath/Muncipality/Corporation"
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div style={{ width: '75%' }}>
          <input
            type="text"
            name="taluk"
            value={formData.taluk}
            onChange={handleChange}
            placeholder="Taluk name"
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div style={{ width: '75%' }}>
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleChange}
            placeholder="District name"
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div style={{ width: '75%' }}>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="State name"
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div style={{ width: '75%' }}>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Country name"
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div className='flex justify-center'>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-2"
          >
            Submit
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
    </div>
  );
}

export default AddDetails;
