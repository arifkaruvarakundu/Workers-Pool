import React, { useState, useEffect } from 'react';
import AxiosInstance from '../../axios_instance';
function ServiceManagement() {
  const [services, setServices] = useState([]);
  const [newServiceTitle, setNewServiceTitle] = useState('');
  const [newServiceDescription, setNewServiceDescription] = useState('');
  const [newServiceImage, setNewServiceImage] = useState(null);
  const [image, setImage] = useState(null);

  const axios=AxiosInstance()

  const fetchServices = async () => {
    try {
      const response = await axios.get('services/', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data)
      setServices(response.data.results);
    } catch (error) {
      console.error('Error fetching services', error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const addService = async () => {
    try {
  
      const formData = new FormData();
      formData.append('Title', newServiceTitle);
      formData.append('description', newServiceDescription);
      formData.append('service_img', image);

      const response = await axios.post('add_service/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newService = response.data;
      console.log(response.data)
      setServices([...services, newService]);

      // Clear the input fields
      setNewServiceTitle('');
      setNewServiceDescription('');
      setImage(null);
    } catch (error) {
      console.error('Error adding service', error);
    }
  };

  const removeService = async (serviceId) => {
    try {
      await axios.delete(`delete_services/${serviceId}`);
      const updatedServices = services.filter((service) => service.id !== serviceId);
      setServices(updatedServices);
    } catch (error) {
      console.error('Error removing service', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-200 to-indigo-500 flex justify-center items-center">
      <div className="p-4 bg-white rounded-lg shadow-lg flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold mb-4 bg-gray-200 py-2 px-4 rounded-tl-lg rounded-tr-lg">
          Service Management
        </h2>

        <div className="flex">
          <div className="w-1/2 mr-4">
            <h3 className="text-xl font-semibold mb-2">Add Service</h3>
            <input
              type="text"
              placeholder="Service Title"
              value={newServiceTitle}
              onChange={(e) => setNewServiceTitle(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />
            <textarea
              placeholder="Service Description"
              value={newServiceDescription}
              onChange={(e) => setNewServiceDescription(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />
            <div className="flex flex-col items-start">
              <img
                alt="Service Preview"
                width="200px"
                height="200px"
                src={image ? URL.createObjectURL(image) : ""}
                className="rounded-lg mb-2"
              />
              <input
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <button
              onClick={addService}
              className="bg-blue-500 text-white py-2 px-4 rounded mt-2"
            >
              Add Service
            </button>
          </div>

          <div className="w-1/2">
            <h3 className="text-xl font-semibold mb-2">Service List</h3>
            <ul>
              {services.map((service) => (
                <li key={service.id} className="flex justify-between items-center border-b py-2">
                  <div className="flex items-center">
                    <img
                      // src={`${service.service_img}`}
                      src={service.service_img.replace(
                        'http://0.0.0.0:9090',
                        'https://workerspool.online'
                      )}
                      alt="Service"
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-semibold">{service.Title}</h4>
                      <p>{}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeService(service.id)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceManagement;
