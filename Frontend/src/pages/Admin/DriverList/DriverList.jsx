import React, { useEffect, useState } from 'react'
import Navbar from '../../NavBar/Navbar'
import AdminAnimation from '../AdminDashboard/DashboardComponents/Animation/AdminAnimation'
import AdminIcons from '../AdminDashboard/DashboardComponents/Animation/AdminIcons'
import AxiosInstance from '../../CustomAxios/axiosInstance';
import Footer from '../../../Components/Footer/Footer'
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { BASE_IMAGE_URL } from '../../Common/BaseUrl';
import NoDp from './../../../assets/Static/Icons/NoDp.png'


library.add(
  faMagnifyingGlass,
);

function DriverList() {

  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const axiosInstance = AxiosInstance()
  const navigate = useNavigate()

  const fetchData = (page = 1) => {
    axiosInstance.get(`driverlist/?page=${page}&search=${searchQuery}`)
      .then(response => {
        console.log("response user",response.data)
        setUsers(response.data.users);
        setTotalPages(response.data.total_pages);
      })
      
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1); 
    fetchData(1); 
  };

 
  return (
    <>
    <Navbar/>
    <div>
    </div>
    <div className='w-full h-24 overflow-hidden mt-12 bg-sky-900 flex text-center  items-center'>
        <div className='w-1/12' >
    <AdminAnimation/>
    </div>
    <div className='w-2/12'>
      <h3 className='font-bold text-3xl text-white '>DRIVERS LIST</h3>
    </div>
    <div className='w-7/12'>
    </div>
    <div className="w-30 mx-2 flex mt-14 ">
    <input  onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery} type="text" placeholder='Search' className=' rounded-xl px-2 py-2 w-44 mb-3 text-center boeder-none' />
    <FontAwesomeIcon onClick={handleSearch} icon="fa-solid fa-magnifying-glass" className='cursor-pointer mx-2 my-3' style={{color: "#fcfcfc",}} />
    </div>
    </div>
    <div className='flex'>
        <div className=' w-24   '>
            <div className=' px-1 py-2  bg-stone-200 h-full   '>
                <AdminIcons/>
            </div>  
        </div>
        <div className=' w-full  m-2   '>
        {users.length > 0 ? (
            users.map((user) => (
              <div key={user.id}  onClick={() => {
                navigate(`/admin/userdetail/${user.id}`);
              }} className="bg-sky-800 border p-4  grid grid-cols-6 gap-2 text-white cursor-pointer   hover:text-sky-950 font-semibold  hover:bg-orange-200"
              >
                {/* Display the user's profile picture */}
                {user.profile_pic ? (
          <img
            src={
              user.profile_pic instanceof File || user.profile_pic instanceof Blob
                ? URL.createObjectURL(user.profile_pic)
                : `${BASE_IMAGE_URL}${user.profile_pic}`
            }
            className="w-12 rounded-full mb-4"
          />
        ) : (
          <img src={NoDp} className="w-12 rounded-full mb-4" />
        )}
                {/* Display user information */}
                <div className="col-span-6 sm:col-span-2 md:col-span-1">
                  <p className=" font-semibold">{user.username}</p>
                </div>
                <div className="col-span-6 sm:col-span-2 md:col-span-1">
                  <p className="">ID: {user.id}</p>
                </div>
                <div className="col-span-6 sm:col-span-2 md:col-span-1">
                  <p className=""> {user.name}</p>
                </div>
                <div className="col-span-6 sm:col-span-2 md:col-span-1">
                  <p className=""> {user.email}</p>
                </div>
                <div className="col-span-6 sm:col-span-2 text-end md:col-span-1">
                  <p className=""> {user.phone}</p>
                </div>
                {/* Button to ban the user */}
                
              </div>))
        ) : ( 
          <div>ffff</div>
        )}

<div className="pagination mt-2 flex justify-center ">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`bg-blue-500 cursor-pointer text-white p-2 rounded ${
              currentPage === 1 ? 'opacity-50 ' : ''
            }`}
          >
            Prev
          </button>
          <span className="bg-sky-800 text-white font-bold p-2 rounded-full mx-4">
            {currentPage}
          </span>
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className={`bg-blue-500 cursor-pointer text-white p-2 rounded ${
              currentPage >= totalPages ? 'opacity-50 ' : ''
            }`}
          >
            Next
          </button>
        </div>
        </div>
        
    </div>
   
    <Footer/>
    </>
  )
}
export default DriverList