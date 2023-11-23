import React from 'react'
import Navbar from '../../../Components/NavBar/Navbar'
import AdminAnimation from './../../../Components/Admin/AdminDashboard/DashboardComponents/Animation/AdminAnimation'
import AdminIcons from './../AdminDashboard/DashboardComponents/Animation/AdminIcons'
import History from './History'
import Footer from '../../Footer/Footer'
import RightSideProfile from './RightSideProfile'
import { useParams } from 'react-router-dom'
import AxiosInstance from './../../CustomAxios/axiosInstance'

function ProfileViewAdmin() {
  

  

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
      <h3 className='font-bold text-3xl text-white '>PROFILE</h3>
    </div>
    <div className='w-7/12'>
    </div>
    <div  className="w-30 mx-12 flex mt-14 mb-6 ">
    </div>
    </div>
    <div className=' flex w-full '>
        <div className=' w-1/12 bg-stone-200  '>
            <div className=' items-center justify-center pl-6  py-2'>
            <AdminIcons/>
            </div>
        </div>
        <div className='w-11/12  flex'>
              <div className=' w-11/12 mt-2 mb-2'>
              <History/>
              </div>
              <div className='w-2/12 bg-gradient-to-r from-stone-700 to-stone-400'>
              <RightSideProfile/>
            </div>
        </div>
    </div>
    <Footer/>
    </>
  )
}

export default ProfileViewAdmin