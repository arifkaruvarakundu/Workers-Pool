import React from 'react'
import AdminDB from './../../../../../assets/AdminDashboard.png'
import Rpool from './../../../../../assets/pending.png'
import workerProfile from './../../../../../assets/workerProfile.png'
import profileimage from './../../../../../assets/img.png'
import bankIcons from './../../../../../assets/Bank.png'
import { Navigate, useNavigate } from 'react-router-dom'

function AdminIcons() {
const navigate=useNavigate()
const NavigateToHome = () =>{
navigate('/Admin_Dashboard')
  }
  const NavigateToServices = () =>{
    navigate('/service_management')
      }
const NavigateToUsers = () =>{
  navigate('/users_workers')
    }
const NavigateToBank = () =>{
  navigate('/')
    }
const NavigateToBookings = () =>{
  navigate('/Bookings')
    }
  return (
    <div className='p-2'>
        <div onClick={NavigateToHome} className='text-center cursor-pointer justify-center items-center flex-col w-16'>
        <img src={AdminDB} alt="" />
        <p className='text-xs  text-sky-900 font-bold'>DASH BOARD</p>
        </div>
        
        <div onClick={NavigateToBookings} className='text-center w-16  mt-2 '>
        <img src={Rpool} alt="" />
        <p className='text-xs font-bold mt-2 text-sky-900  '>BOOKINGS</p>
        </div>
        <div onClick={NavigateToServices} className=' cursor-pointer text-center mt-2 w-16'>
        <img src={workerProfile} alt="" />
        <p className='text-xs font-bold text-sky-900'>SERVICES</p>
        </div>
        <div onClick={NavigateToUsers} className='text-center mt-2 w-16'>
        <img src={profileimage} alt="" />
        <p className='text-xs font-bold text-sky-900'>USERS</p>
        </div>
        <div onClick={NavigateToBank} className='text-center mt-2 w-16'>
        <img src={bankIcons} alt="" />
        <p className='text-xs font-bold text-sky-900'>HOME</p>
        </div>

        
    </div>
  )
}

export default AdminIcons;

