import React, { useEffect, useState } from 'react'
import AdminAnimation from '../AdminDashboard/DashboardComponents/Animation/AdminAnimation'
import AdminIcons from '../AdminDashboard/DashboardComponents/Animation/AdminIcons'
import Navbar from '../../NavBar/Navbar'
import Footer from '../../Footer/Footer'
import { useNavigate } from 'react-router-dom'
import AxiosInstance from '../../CustomAxios/axiosInstance';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';

library.add(
    faMagnifyingGlass,
  );
  

function Requests() {

const [searchQuery, setSearchQuery] = useState('');
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const axiosInstance = AxiosInstance()
const [selectedOption, setSelectedOption] = useState('All');
const [historyData, setHistoryData] = useState([]);
const [driver, setdriver] = useState();
const navigate = useNavigate()
const dropdownOptions = ['All', 'Confirmed', 'Completed','Started','Pending','Repooled'];

const user_id=0


  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchData(1);
  };

  const fetchData = (page = 1, search = '', option = 'All') => {
    axiosInstance.get(`admin/history/all/?page=${page}&search=${search}&option=${option}`)
      .then(response => {
        console.log("response history", response.data.tripRequests);
        setHistoryData(response.data.tripRequests);
        setTotalPages(response.data.total_pages);
        setdriver(response.data.driver)
      })
      .catch(error => {
        console.error('Error fetching history data:', error);
      });
  };

  useEffect(() => {
    fetchData(currentPage, searchQuery, selectedOption);
  }, [currentPage, searchQuery, selectedOption]);

  const handleDropdownChange = (e) => {
    setSelectedOption(e.target.value);
    console.log(selectedOption)
  }
  
  return (
    <div>
        <Navbar/>
        <div className='hidden md:block'>

        
        <div className='bg-sky-900 mt-12 flex items-center'>
            <div className='w-1/12 '>
            <AdminAnimation/>
            </div>
            <div className='w-2/12'>
            <h3 className='font-bold text-3xl text-white '>REQUESTS</h3>
            </div>
            <div className='w-7/12'></div>
            <div className='w-4/12 mt-20'>
            <div className="w-30 mx-2 flex mt-2 ">
            <input  onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery} type="text" placeholder='Search' className=' rounded-xl  py-2 w-44 mb-2 text-center boeder-none' />
              <select
              value={selectedOption}
              onChange={handleDropdownChange}
              className='rounded-3xl mx-2  px-8 text-sm h-10 bg-white'
            >
              {dropdownOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <FontAwesomeIcon onClick={handleSearch} icon="fa-solid fa-magnifying-glass" className='cursor-pointer mx-2 my-3' style={{color: "#fcfcfc",}} />
            </div>
            </div>


        </div>
        <div className='flex'>
            <div className='bg-stone-200'>
                <AdminIcons/>
            </div>
            <div className='w-full'>
            <div className='bg-sky-900 mt-1'>
   <div className='w-full'>
    {historyData.length > 0 ? (
        historyData.map((historyData) => (
            <div key={historyData.id}  onClick={() => {
              navigate(`/trip_request_detail/${historyData.id}`);
            }} className="bg-sky-800 border p-4  grid grid-cols-10 gap-2 text-white cursor-pointer   hover:text-sky-950 font-semibold  hover:bg-orange-200"
            >

                <div className="col-span-8 sm:col-span-2 md:col-span-1">
                  <p className=" font-semibold">{historyData.id}</p>
                </div>
                <div className="col-span-8 sm:col-span-2 md:col-span-1">
                  <p className=" font-semibold">{historyData.from_location}</p>
                </div>
                <div className="col-span-8 sm:col-span-2 md:col-span-1">
                  <p className=" font-semibold">{historyData.from_location.to_location}</p>
                </div>
                <div className="col-span-8 sm:col-span-2 md:col-span-1">
                  <p className=" font-semibold">{historyData.status}</p>
                </div>
                <div className="col-span-8 sm:col-span-2 md:col-span-1">
                  <p className=" font-semibold"> <span>{historyData.car.make} </span> 
                  <span>{historyData.car.model} </span>   
                  (<span>{historyData.car.year_of_make}) </span></p>
                </div>
                <div className="col-span-8 sm:col-span-2 md:col-span-1">
                  <p className=" font-semibold">{historyData.journey_start_date}</p>
                </div>
                <div className="col-span-8 sm:col-span-2 md:col-span-1">
                  <p className=" font-semibold">{historyData.to_location}</p>
                </div>
                {Array.isArray(historyData.drivers) ? (
  historyData.drivers.map((driver, driverIndex) => (
    <div key={driverIndex}>
      <p className="font-semibold">{driver.driver_name}</p>
      <p className="font-semibold">{driver.driver_status}</p>
    </div>
  ))
) : (
  <div>
    <p className="font-semibold">{historyData.driver.driver_name}</p>
    <p className="font-semibold">{historyData.driver.driver_status}</p>
  </div>
)}
<div className="col-span-8 sm:col-span-2 md:col-span-1">
<p className=" font-semibold">{historyData.user.name}</p>
<p className=" font-semibold">{historyData.user.username}</p>
</div>



        </div>))
    ) : (
        <div className='grid grid-cols-10 p-4 '> 
  <div className=' col-span-1  font-bold text-2xl text-white text-center'>
    <h1>No Trips Found</h1>
  </div>
        
        </div>
    )}
   </div>
</div>
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
        </div>
        <div>
          
        </div>
        <Footer/>
    </div>
  )
}

export default Requests