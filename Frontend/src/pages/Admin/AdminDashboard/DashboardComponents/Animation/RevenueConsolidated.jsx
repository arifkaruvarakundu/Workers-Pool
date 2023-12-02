import React, { useEffect, useState } from 'react'
import AxiosInstance from './../../../../../../axios_instance'
import LogoMoney from '../../../../../assets/LogoMoney.png'
import MoneyGolden from './../../../../../assets/MoneyGolden.png'


function RevenueConsolidated() {
    const axios=AxiosInstance()
    const [details, setDetails] = useState({
        total_users: 0,
        total_workers: 0,
        total_balance: 0,
        total_revenue_week: 0,
        total_revenue_month: 0,
        total_revenue_year: 0,
        pending_bookings: 0,
        accepted_bookings: 0,
        cancelled_bookings: 0,
        rejected_bookings: 0,
        total_revenue_today: 0,

      });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('dashboard/');
        setDetails(response.data);
        console.log(response.data);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);
  return (
    <div className='md:flex w-full'>
            <div className=' flex w-full mb-1 md:w-1/4 mx-2 shadow-2xl bg-warm-gray-600 border'>
                <img src={LogoMoney} className='w-32 p-2' alt="" />
                <div className='py-4 px-2'>
                    <p>Today's Revenue</p>
                    <p className='font-bold text-sky-900'>{details.total_revenue_today}</p>
                </div>
            </div>
            <div className=' flex w-full mb-1 md:w-1/4 mx-2 shadow-2xl bg-warm-gray-600 border'>
                <img src={LogoMoney} className='w-32 p-2' alt="" />
                <div className='py-4 px-2'>
                    <p>Revenue of the week</p>
                    <p className='font-bold text-sky-900'>{details.total_revenue_week}</p>
                </div>
            </div>
            <div className=' flex w-full mb-1 md:w-1/4 mx-2 shadow-2xl bg-warm-gray-600 border'>
                <img src={LogoMoney} className='w-32 p-2' alt="" />
                <div className='py-4 px-2'>
                    <p>Revenue of the Month</p>
                    <p className='font-bold text-sky-900'>{details.total_revenue_month}</p>
                </div>
            </div>
            <div className=' flex w-full mb-1 md:w-1/4 mx-2 shadow-2xl bg-warm-gray-600 border'>
                <img src={LogoMoney} className='w-32 p-2' alt="" />
                <div className='py-4 px-2'>
                    <p>Revenue of the Year</p>
                    <p className='font-bold text-sky-900'>{details.total_revenue_year}</p>
                </div>
            </div>
            <div className=' flex w-full mb-1 md:w-1/4 mx-2 shadow-2xl bg-warm-gray-600 border'>
                <img src={MoneyGolden} className='w-32 p-2' alt="" />
                <div className='py-4 px-2'>
                    <p>Total Revenue</p>
                    <p className='font-bold text-sky-900'>{details.total_balance}</p>
                </div>
            </div>
    
    </div>
  )
}

export default RevenueConsolidated