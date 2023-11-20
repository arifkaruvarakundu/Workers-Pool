import React, { useState, useEffect, useNavigate} from 'react';
import AxiosInstance from '../../axios_instance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';


function AddDetails() {
  const userRoleFromLocalStorage = localStorage.getItem('user_role');
  const isWorker = userRoleFromLocalStorage === 'worker';
  const user_id = localStorage.getItem('user_id');
  
  const axios=AxiosInstance()

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    mobile_number: '',
    street_name: '',
    house_number: '',
    ward: '',
    panchayath_municipality_corporation: '',
    taluk: '',
    district: '',
    state: '',
    country: '',
    ...(isWorker && {
      services: [],
      years_of_experience: '',
      license_certificate: null,
      min_charge: '',
      charge_after_one_hour: '',
    }),
  });

  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  useEffect(() => {
    axios
      .get('services/')
      .then((response) => {
        setServices(response.data.results);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const serviceOptions = services.map((service) => ({
    value: service.id,
    label: service.Title,
  }));

  const handleSelectChange = (selectedOptions) => {
    setSelectedServices(selectedOptions);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
  
    if (file) {
      setFormData({
        ...formData,
        license_certificate: file,
      });
    }
  };
  

  const handleSubmit =  () => {
    const dataToSend = new FormData();
    dataToSend.append('user_id', user_id);
    dataToSend.append('first_name', formData.first_name);
    dataToSend.append('last_name', formData.last_name);
    dataToSend.append('mobile_number', formData.mobile_number);
    dataToSend.append('role', userRoleFromLocalStorage);
    dataToSend.append('street_name', formData.street_name);
    dataToSend.append('house_number', formData.house_number);
    dataToSend.append('ward', formData.ward);
    dataToSend.append('panchayath_municipality_corporation', formData.panchayath_municipality_corporation);
    dataToSend.append('taluk', formData.taluk);
    dataToSend.append('district', formData.district);
    dataToSend.append('state', formData.state);
    dataToSend.append('country', formData.country);
    

    if (isWorker) {
      const selectedServiceIds = selectedServices.map((option) => option.value);
      dataToSend.append('services',selectedServiceIds);
      dataToSend.append('years_of_experience', formData.years_of_experience);
      dataToSend.append('min_charge', formData.min_charge);
      dataToSend.append('charge_after_one_hour', formData.charge_after_one_hour);
    }

    if (formData.license_certificate) {
      dataToSend.append('license_certificate', formData.license_certificate);
    }
   

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
  
    try {
      const response =  axios.post('add_details/', dataToSend, config);
  
      console.log('User details added successfully');
      toast.success('Submitted successfully',{
      autoClose: 50000,});
      
      
    } catch (error) {
      console.error('Failed to add user details', error);
  
      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data && data['services']) {
          toast.error(data['services'][0]);
        }
      }
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-200 to-indigo-500 flex justify-center items-center">
      <div className="p-4 bg-white rounded-lg shadow-lg flex flex-col justify-center items-center w-[50%]">
        <h2 className="text-2xl font-bold mb-4 bg-gray-200 py-2 px-4 rounded-tl-lg rounded-tr-lg">
          Add Details
        </h2>
        <form className="space-y-4 w-full px-10">
          <div>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="First Name"
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div >
            <input
              type="text"
              name="mobile_number"
              value={formData.mobile_number}
              onChange={handleChange}
              placeholder="Mobile Number"
              className="w-full p-2 border rounded-lg"
            />
          </div>
          {isWorker && (
            <>
              <div >
                <Select
                  name="services"
                  value={selectedServices}
                  onChange={handleSelectChange}
                  options={serviceOptions}
                  placeholder="Select your field of work"
                  isMulti
                />
              </div>
              <div >
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
              <div >
                <input
                  type="text"
                  name="years_of_experience"
                  value={formData.years_of_experience}
                  onChange={handleChange}
                  placeholder="Years of experience"
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div >
                <input
                  type="text"
                  name="min_charge"
                  value={formData.min_charge}
                  onChange={handleChange}
                  placeholder="Min.charge(for first 1 hour)"
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div >
                <input
                  type="text"
                  name="charge_after_one_hour"
                  value={formData.charge_after_one_hour}
                  onChange={handleChange}
                  placeholder="Charge after one hour"
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </>
          )}
          <strong style={{ textDecoration: 'underline' }}>Address</strong>
          <div >
            <input
              type="text"
              name="street_name"
              value={formData.street_name}
              onChange={handleChange}
              placeholder="Street name"
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div >
            <input
              type="text"
              name="house_number"
              value={formData.house_number}
              onChange={handleChange}
              placeholder="House No."
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div >
            <input
              type="text"
              name="ward"
              value={formData.ward}
              onChange={handleChange}
              placeholder="Ward No."
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div >
            <input
              type="text"
              name="panchayath_municipality_corporation"
              value={formData.panchayath_municipality_corporation}
              onChange={handleChange}
              placeholder="Panchayath/Muncipality/Corporation"
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div >
            <input
              type="text"
              name="taluk"
              value={formData.taluk}
              onChange={handleChange}
              placeholder="Taluk name"
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div >
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleChange}
              placeholder="District name"
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div >
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State name"
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div >
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Country name"
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-blue-500 hover-bg-blue-600 text-white rounded-full px-4 py-2"
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
