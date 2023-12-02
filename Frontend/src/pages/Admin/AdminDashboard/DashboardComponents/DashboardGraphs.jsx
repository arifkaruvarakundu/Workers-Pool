import React, { useEffect, useState } from 'react'
import AxiosInstance from './../../../../../axios_instance'
import { Pie, Doughnut,Bar } from 'react-chartjs-2';
import {Chart, ArcElement, Tooltip, Legend, Title} from 'chart.js';
import {  registerables } from 'chart.js';
Chart.register(...registerables);
Chart.register(ArcElement, Tooltip, Legend, Title);
Chart.defaults.plugins.tooltip.backgroundColor = 'rgb(0, 0, 156)';
Chart.defaults.plugins.legend.position = 'bottom';
Chart.defaults.plugins.legend.title.display = true;
Chart.defaults.plugins.legend.title.text = '';
Chart.defaults.plugins.legend.title.font = 'Helvetica Neue';

function DashboardGraphs() {
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


  const Doughnutdata = {
    labels: ['Users', 'Workers'],
    datasets: [
      {
        data: [details.total_users, details.total_workers],
        backgroundColor: ['#36A2EB', '#FFCE56'],
      },
    ],
  };

  // Define chart options (you can customize this)
  const Doughnutoptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true, // Hide default legend
      },
      tooltip: {
        callbacks: {
            label: (context) => {
                const label = Doughnutdata.labels[context.dataIndex];
                const value = Doughnutdata.datasets[0].data[context.dataIndex];
                return `${label}: ${value}`;
              },
        },
      },
    },
  };

  const pieData = {
    labels: ['Pending', 'Accepted','Cancelled','Rejected'],
    datasets: [
      {
        data: [details.pending_bookings, details.accepted_bookings,details.cancelled_bookings,details.rejected_bookings],
        backgroundColor: ['#ff0000','#008000','#4933FF', '#353839'],
      },
    ],
  };
  const pieOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true, // Hide default legend
      },
      cutout: 0, // Set cutout to 0 for a Pie chart (no hole in the center)
      tooltip: {
        callbacks: {
            label: (context) => {
                const label = pieData.labels[context.dataIndex];
                const value = pieData.datasets[0].data[context.dataIndex];
                return `${label}: ${value}`;
              },
        },
      },
    },
  };


  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toLocaleDateString());
  }

    const daily_revenue_data = [5000, 7000, 25000, 8000, 9000, 24000, 15000];
    const daily_Bookings_data = [5, 6, 12, 4, 9, 16, 9];

    const barChartData = {
        labels: dates,
        datasets: [
          {
            label: 'Daily Revenue',
            data: daily_revenue_data,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
          
        ],
      };
      
      const barChartOptions = {
        maintainAspectRatio: false,
        scales: {
          x: [
            {
              type: 'time', // Use 'time' for date labels
              time: {
                unit: 'day',
                displayFormats: {
                  day: 'MM/DD',
                },
              },
            },
          ],
          y: {
            beginAtZero: true,
          },
        },
      };


      const barChartDataBooking = {
        labels: dates,
        datasets: [
          
          {
            label: 'Daily Bookings',
            data: daily_Bookings_data,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
        ],
      };
      
      const barChartOptionsBooking = {
        maintainAspectRatio: false,
        scales: {
          x: [
            {
              type: 'time', // Use 'time' for date labels
              time: {
                unit: 'day',
                displayFormats: {
                  day: 'MM/DD',
                },
              },
            },
          ],
          y: {
            beginAtZero: true,
          },
        },
      };
      

  return (
    <div>
    <div className='md:flex mt-2 h-60 mb-12'>
    <div className="chart-container mr-2 w-full md:w-1/2" style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
      <Doughnut data={Doughnutdata} options={Doughnutoptions} />
    </div>
    <div className="chart-container ml-2 w-full md:w-1/2" style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
    <Pie data={pieData} options={pieOptions} />
    </div>
    </div>
    <div className='hidden md:flex h-60 md:mt-2 mt-6'>
    <div className="chart-container w-full md:mt-0 mt-4 h- ml-2 md:w-1/2" style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
    <Bar data={barChartData} options={barChartOptions} />
    </div>
    <div className="chart-container w-full md:mt-0 mt-4 ml-2 md:w-1/2" style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
    <Bar data={barChartDataBooking} options={barChartOptionsBooking} />
    </div>
    </div>
    </div>
  )
}

export default DashboardGraphs