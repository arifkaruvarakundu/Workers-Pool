import axios from 'axios';

// Create a custom Axios instance with default configurations
const AxiosInstance =()=>{

  const accessToken = localStorage.getItem('access');
  const axiosInstance = axios.create({
    baseURL: 'https://workerspool.online/', // Replace with your base URL
    timeout: 25000,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    withCredentials: true,
  })
    return axiosInstance;
};

// You can also define request interceptors, response interceptors, and other custom settings here.

export default AxiosInstance;
