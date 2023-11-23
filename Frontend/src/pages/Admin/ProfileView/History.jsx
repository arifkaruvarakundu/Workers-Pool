import React, { useEffect, useState } from 'react'
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
library.add(
    faMagnifyingGlass,
  );
import AxiosInstance from './../../CustomAxios/axiosInstance'
import { useNavigate, useParams } from 'react-router-dom';

function History() {
    const { user_id } = useParams();
    const axiosInstance = AxiosInstance()
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOption, setSelectedOption] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [historyData, setHistoryData] = useState([]);
    const [driver, setdriver] = useState();
    const navigate= useNavigate()

  const dropdownOptions = ['All', 'Confirmed', 'Completed','Started','Pending','Repooled'];

console.log("userID",user_id)
  const fetchData = (page = 1, search = '', option = 'All') => {
    axiosInstance.get(`admin/history/${user_id}/?page=${page}&search=${search}&option=${option}`)
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
  console.log("historydata",historyData);

  useEffect(() => {
    fetchData(currentPage, searchQuery, selectedOption);
  }, [currentPage, searchQuery, selectedOption]);

  
  const handleSearchquery = (e) => {
    setSearchQuery(e.target.value);
    console.log(searchQuery)
  }

  const handleDropdownChange = (e) => {
    setSelectedOption(e.target.value);
    console.log(selectedOption)
  }

  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      console.log("page",currentPage)
    }
  };
  const handleSearch = () => {
    setCurrentPage(1);
    fetchData(1, searchQuery, selectedOption);
  };

  return (
    <div className='w-full'>
        <div className='flex p-2 bg-stone-800'> 
<div className=' w-2/12 text-white font-semibold text-2xl'>
    <h1 className='p-2'>Trip History</h1>
</div>
<div className='w-6/12'></div>
<div className='w-4/12 '>
<div className='flex justify-center  mt-2 '>
            {/* Search input */}
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchquery}
              className='rounded-3xl px-1 w-36 text-center border-none'
            />
             
            {/* Dropdown */}
            <select
              value={selectedOption}
              onChange={handleDropdownChange}
              className='rounded-3xl mx-2 py-1 px-4 bg-white'
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
<div className='bg-sky-900 mt-1'>
   <div>
    {historyData.length > 0 ? (
        historyData.map((historyData) => (
            <div key={historyData.id}  onClick={() => {
              navigate(`/trip_request_detail/${historyData.id}`);
            }} className="bg-sky-800 border p-4 font-semibold grid grid-cols-8 gap-2 text-white cursor-pointer   hover:text-sky-950 font-semibold  hover:bg-orange-200"
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



        </div>))
    ) : (
        <div className='p-4 font-bold text-2xl text-white text-center'>No Trips Found 
  
        
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
  )
}

export default History