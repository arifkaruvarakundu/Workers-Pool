import React, { useEffect, useState } from 'react'
import AxiosInstance from './../../../Components/CustomAxios/axiosInstance'; // Import your Axios instance
import { useSelector } from 'react-redux'; // Import the useSelector hook if you're using Redux
import { selectUserData } from './../../../Components/Redux/authSlice'; // Replace with the actual path to your user slice/selectors
import Modal from 'react-modal';
import { BASE_IMAGE_URL } from '../../../Components/Common/BaseUrl';
import { useParams } from 'react-router-dom';

function RightSideProfile() {
    const { user_id } = useParams();
    const axiosInstance = AxiosInstance(); // Initialize your Axios instance
    const userData = useSelector(selectUserData); // Replace with the selector that accesses user data in Redux
    const { userId } = userData;
    const [userDetails, setUserDetails] = useState({
      profile_img: '',
      name: '',
      email: '',
      phone: '',
      username: '',
    });
    const [active,setActive]=useState(true)
    console.log("params::",user_id)

    

    
    
    useEffect(() => {
      // Fetch user details from your backend API using Axios instance
      axiosInstance
        .get(`/users/${user_id}/`) // Replace with the actual API endpoint for fetching user details
        .then((response) => {
          const userResponseData = response.data;
          console.log("getuser",userResponseData)
        setUserDetails({
  
          profile_img: userResponseData.profile_img,
          first_name: userResponseData.first_name,
          email: userResponseData.email,
          phone: userResponseData.phone,
          username: userResponseData.username,
          isActive:userResponseData.is_active
        });
        if(userDetails.is_active){setActive(true)}
        else{setActive(false)}
        
        console.log("active",active)
        })
        .catch((error) => {
          console.error('Error fetching user details:', error);
        });
    }, [active]);
  
    console.log("img:::",userDetails.profile_img)
    
  
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmissionSuccess, setIsSubmissionSuccess] = useState(false);
  
    const openModal = () => {
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
      setIsSubmissionSuccess(false); // Reset success state
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        console.log(userDetails);
        const formData = new FormData();
        formData.append('first_name', userDetails.first_name);
        formData.append('email', userDetails.email);
        formData.append('phone', userDetails.phone);
        formData.append('username', userDetails.username);
        // Check if the profile_img is a File or Blob
        if (userDetails.profile_img instanceof File || userDetails.profile_img instanceof Blob) {
          formData.append('profile_img', userDetails.profile_img);
        }
        const response = await axiosInstance.put(`/update-profile/${userId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.status === 200) {
          setIsSubmissionSuccess(true);
        } else {
          console.error('Update failed.');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    
    const handleInputChange = (e) => {
      const { name, value, type, files } = e.target;
      const newValue = type === 'file' ? files[0] : value;
  
      setUserDetails({
        ...userDetails,
        [name]: newValue,
      });
    };

    const handleBan = () => {
      axiosInstance
        .put(`/admin/ban-user/${user_id}/`, { is_deleted: true })
        .then((response) => {
          console.log('User banned successfully', response.data);
          // Update the component state to re-render
          setUserDetails((prevUserDetails) => ({
            ...prevUserDetails,
            isActive: false,
          }));
        })
        .catch((error) => {
          console.error('Error banning user:', error);
        });
    };
  
    const handleUnBan = () => {
      axiosInstance
        .put(`/admin/unban-user/${user_id}/`, { is_deleted: true })
        .then((response) => {
          console.log('User unbanned successfully', response.data);
          // Update the component state to re-render
          setUserDetails((prevUserDetails) => ({
            ...prevUserDetails,
            isActive: true,
          }));
        })
        .catch((error) => {
          console.error('Error unbanning user:', error);
        });
    }
  
  
  
    return (
      <>
          <div className=' pt-12 flex flex-col   bg-gradient-to-r from-stone-700 to-stone-400'>
          {/* Profile Image */}
          <div className='w-48 mx-2 rounded-full overflow-hidden'>
            
  
  
  <img
                src={userDetails.profile_img
                  ? (userDetails.profile_img instanceof File || userDetails.profile_img instanceof Blob)
                    ? URL.createObjectURL(userDetails.profile_img)
                    : `${BASE_IMAGE_URL}${userDetails.profile_img}` 
                  : ''}
                className="w-32 h-32 rounded-full mx-auto mb-4"
            />
  
          </div>
  
          {/* Profile Information */}
          <div className='text-gray-200 p-4 text-center'>
            <h2 className='text-2xl font-bold'>{userDetails.first_name}</h2>
            <p>Email: {userDetails.email}</p>
            <p>Phone: {userDetails.phone}</p>
            <p>Username: {userDetails.username}</p>
  
            
          </div>
        </div>
        {userDetails.isActive ? (<div onClick={handleBan} className="w-30 mx-12 flex mt-14 mb-6 ">

<a href="#_" class="rounded-md px-3.5 py-2 m-1 overflow-hidden relative group cursor-pointer border-2 font-medium border-red-500 bg-red-200  text-black">
<span class="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-red-600 top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
<span class="relative text-black transition duration-300 group-hover:text-white ease">BAN USER</span>
</a>
</div>):(
  (<div onClick={handleUnBan} className="w-30 mx-12 flex mt-14 mb-6 ">

  <a href="#_" class="rounded-md px-3.5 py-2 m-1 overflow-hidden relative group cursor-pointer border-2 font-medium border-green-500  text-white">
  <span class="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-green-600 top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
  <span class="relative text-white transition duration-300 group-hover:text-white ease">UN BAN USER</span>
  </a>
  </div>)
)}
        
  
        
  
  
      </>
    )
  }

export default RightSideProfile