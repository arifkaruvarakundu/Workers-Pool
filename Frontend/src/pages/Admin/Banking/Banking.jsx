import React, { useEffect, useState } from 'react';
import AxiosInstance from './../../CustomAxios/axiosInstance'
import Navbar from '../../NavBar/Navbar';
import Footer from '../../Footer/Footer';
import AdminIcons from '../AdminDashboard/DashboardComponents/Animation/AdminIcons';
import AdminAnimation from '../AdminDashboard/DashboardComponents/Animation/AdminAnimation';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import sendWebSocketMessage from './../../Notification/SendWebSocketFunction'

function Banking() {
  const [bankTransferDetails, setBankTransferDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page // Current page
  const [responseStatus, setResponseStatus] = useState(200);
  const perPage = 1; // Items per page
  const axiosInstance = AxiosInstance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bankRefId, setBankRefId] = useState(null);
  const [comments, setComments] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);


  // useEffect(() => {
  //   // Make the Axios call to get bank transfer details
  //   axiosInstance.get(`get_bank_transfer_details?page=${page}&itemsPerPage=${itemsPerPage}`)
  //     .then((response) => {
  //       // Assuming the response contains an array of bank transfer details
  //       console.log("new::",response.data)
  //       setBankTransferDetails(response.data);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching bank transfer details:', error);
  //     });
  // }, [page]); // Include 'page' as a dependency


  const fetchPendingRequests = (page) => {
    axiosInstance
      .get('get_bank_transfer_details', {
        params: {
          page: page,
          per_page: perPage,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("request bank data",response.data)
          setBankTransferDetails(response.data.results);
          console.log("pendingp",response.data.results);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setResponseStatus(404);
        if (currentPage > 1 && error.response && error.response.status === 404) {
          setCurrentPage(currentPage - 1);
        }
        Swal.fire({
          icon: 'info',
          title: 'No more request',
          text: 'There are no more pending trip requests.',
        });
      });
  };

  useEffect(() => {
    fetchPendingRequests(currentPage);
  }, [currentPage]);

  
  const changePage = (newPage) => {
    setCurrentPage(newPage); // Update the current page
  };
  
  const handleDone = (id) => {
    const data = {
      bankRefId: bankRefId,
      comments: comments,
      id: selectedTrip.id,
    };
    axiosInstance
      .post('bank_transfer_done/', data)
      .then((response) => {
        console.log('API response:', response.status);
        setBankRefId(null)
        setComments(null)
        const roomName = selectedTrip.user_details.id; 
        const messageContent = `Your payment request ID : ${selectedTrip.id}, Amount ${selectedTrip.amount} is completed`;
          sendWebSocketMessage(roomName, messageContent);
        setIsModalOpen(false);
      })
      .catch((error) => { 
        console.error('API error:', error);
        if (error.response.status==588)
            Swal.fire({
              icon: 'error',
              title: 'Check your input',
              text: 'reference ID is needed',
            });
            if (error.response.status==587)
            Swal.fire({
              icon: 'error',
              title: 'Check your input',
              text: 'Comment is needed',
            });
            if (error.response.status==585)
            Swal.fire({
              icon: 'error',
              title: 'Already Rejected',
              text: 'The payment request is rejected'
            });
            if (error.response.status==586)
            Swal.fire({
              icon: 'error',
              title: 'Already done',
              text: 'The payment request is already fullfilled successfully'
            });
      });
  };

  const handleRejected = (id) => {
    const data = {
      
      comments: comments,
      id: selectedTrip.id,
    };
    axiosInstance
      .post('bank_transfer_rejected/', data)
      .then((response) => {
        console.log('API response:', response.status);
        setComments(null)
        const roomName = selectedTrip.user_details.id; 
        const messageContent = `Your payment request ID : ${selectedTrip.id}, Amount ${selectedTrip.amount} is rejected we send a mail with the details`;
          sendWebSocketMessage(roomName, messageContent);
        setIsModalOpen(false);
      })
      .catch((error) => { 
        console.error('API error:', error);
            if (error.response.status==587)
            Swal.fire({
              icon: 'error',
              title: 'Check your input',
              text: 'Comment is needed',
            });
            if (error.response.status==583)
            Swal.fire({
              icon: 'error',
              title: 'Already Rejected',
              text: 'The payment request details is rejected',
            });
            if (error.response.status==584)
            Swal.fire({
              icon: 'error',
              title: 'Already Done',
              text: 'The payments to this id is already done',
            });
      });
  };

  const openModal = (trip) => {
    setSelectedTrip(trip); // Set the selected trip
    setIsModalOpen(true)
    console.log("trip::::",trip);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Calculate the index of the first and last item on the current page
  

  // Function to handle page changes
  

  return (
    <div>
      <Navbar />
      <div className='hiddden md:block'>
      <div className='w-full h-24 overflow-hidden mt-12 bg-sky-900 flex text-center items-center'>
        <AdminAnimation />
        <h3 className='font-bold text-3xl text-white'>BANKING</h3>
      </div>
      <div className='w-full hidden md:flex'>
        <div className='px-1 py-2 bg-stone-200'>
          <AdminIcons />
        </div>
        <div>
          
        
        <div className="w-full">
          <div>
          <div className="shadow-xl">
  {bankTransferDetails.length > 0 ? (
    bankTransferDetails.map((trip) => (
      <div key={trip.id}  onClick={() => openModal(trip)}  className="bg-sky-800 border p-4   grid grid-cols-6 gap-2 text-white cursor-pointer transform transition-transform  hover:text-black hover:bg-orange-200">
        
        <div className='grid grid-cols-6'>
        <p> {trip.id}</p>
        </div>
        <div className='grid grid-cols-6'>
            <div>
            <p className='ml-2 font-medium'>{trip.user_details.first_name}</p>
        <p className='ml-2'>{trip.user_details.email}</p>
        <p className='ml-2'>{trip.user_details.phone}</p>
            </div>
            <div className='justify-center flex '>
            
            </div>
        </div>
        <div>
        <p className='ml-2 font-medium'>{trip.user_details.first_name}</p>
        <p className='ml-2'>Bank: {trip.bank_name}</p>
        <p className='ml-2'>Branch:  {trip.bank_branch}</p>
        
        
        </div>
        <div>
        <p>Account: {trip.account_number}</p>
        <p className='ml-2'>Ifsc: {trip.ifsc}</p>
        <p> {trip.amount}</p>
        
        
        </div>
        <div>
        <p> Posted On: {new Date(trip.created_at).toLocaleDateString()}</p>
        <p> {trip.status}</p>
        </div>
        <div>
        <p> Bank Ref ID: {trip.bank_reference_id}</p>
         {trip.payment_on ? (
            <p> Payment Date: {new Date(trip.payment_on).toLocaleDateString()}</p>
          ) : (
            <p> Payment Date: Not entered</p>
          )}
        </div>
        
        {/* Add other trip details you want to display */}
        
      </div>
    ))
  ) : (
    <div className="grid grid-cols-5">
      <div></div><div></div>
    <p >No pending trip requests found.</p>
    </div>
  )}
</div>
          </div>
          <div className='pagination mt-2 flex justify-center '>
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`bg-blue-500 cursor-pointer text-white p-2 rounded ${currentPage === 1 ? 'opacity-50 ' : ''}`}
          >
            Prev 
          </button>
          <span className="bg-sky-800 text-white font-bold p-2 rounded-full mx-4"> {currentPage}</span>
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={bankTransferDetails.length < perPage || responseStatus === 404}
            className={`bg-blue-500 cursor-pointer text-white p-2 rounded ${
              bankTransferDetails.length < perPage || responseStatus === 404 ? 'opacity-50 ' : ''
            }`}
          >
            Next
          </button>
          </div>
        </div>

        
          </div>
        
      </div>
      </div>

      <div className='md:hidden'>
      <div className="w-full">
          <div>
          <div className="shadow-xl">
  {bankTransferDetails.length > 0 ? (
    bankTransferDetails.map((trip) => (
      <div key={trip.id}  onClick={() => openModal(trip)}  className="bg-sky-800 border p-4   grid md:grid-cols-6 gap-2 text-white cursor-pointer transform transition-transform  hover:text-black hover:bg-orange-200">
        
        <div className='md:grid grid-cols-6'>
        <p> {trip.id}</p>
        </div>
        <div className='md:grid grid-cols-6'>
            <div>
            <p className='ml-2 font-medium'>{trip.user_details.first_name}</p>
        <p className='ml-2'>{trip.user_details.email}</p>
        <p className='ml-2'>{trip.user_details.phone}</p>
            </div>
            <div className='justify-center flex '>
            
            </div>
        </div>
        <div>
        <p className='ml-2 font-medium'>{trip.user_details.first_name}</p>
        <p className='ml-2'>Bank: {trip.bank_name}</p>
        <p className='ml-2'>Branch:  {trip.bank_branch}</p>
        
        
        </div>
        <div>
        <p>Account: {trip.account_number}</p>
        <p className='ml-2'>Ifsc: {trip.ifsc}</p>
        <p> {trip.amount}</p>
        
        
        </div>
        <div>
        <p> Posted On: {new Date(trip.created_at).toLocaleDateString()}</p>
        <p> {trip.status}</p>
        </div>
        <div>
        <p> Bank Ref ID: {trip.bank_reference_id}</p>
         {trip.payment_on ? (
            <p> Payment Date: {new Date(trip.payment_on).toLocaleDateString()}</p>
          ) : (
            <p> Payment Date: Not entered</p>
          )}
        </div>
        
        {/* Add other trip details you want to display */}
        
      </div>
    ))
  ) : (
    <div className="grid grid-cols-5">
      <div></div><div></div>
    <p >No  requests found.</p>
    </div>
  )}
</div>
          </div>
          <div className='pagination mt-2 flex justify-center '>
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`bg-blue-500 cursor-pointer text-white p-2 rounded ${currentPage === 1 ? 'opacity-50 ' : ''}`}
          >
            Prev 
          </button>
          <span className="bg-sky-800 text-white font-bold p-2 rounded-full mx-4"> {currentPage}</span>
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={bankTransferDetails.length < perPage || responseStatus === 404}
            className={`bg-blue-500 cursor-pointer text-white p-2 rounded ${
              bankTransferDetails.length < perPage || responseStatus === 404 ? 'opacity-50 ' : ''
            }`}
          >
            Next
          </button>
          </div>
        </div>

      </div>
      
      <Footer />


      <Modal
  isOpen={isModalOpen}
  onRequestClose={closeModal}
  contentLabel="Bank Transfer Modal"
  className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 shadow-lg rounded w-full md:w-1/2"
>
  <h2 className="text-xl font-bold mb-4">Bank Transfer</h2>
  <div className="mb-2">
    <label className="block">Bank Reference ID:</label>
    <input
      type="text"
      value={bankRefId}
      onChange={(e) => setBankRefId(e.target.value)}
      className="w-full border rounded p-2"
    />
  </div>
  <div className="mb-2">
    <label className="block">Comments:</label>
    <textarea
      value={comments}
      onChange={(e) => setComments(e.target.value)}
      className="w-full border rounded p-2"
    />
  </div>
  <div className="text-center">
    <button
      onClick={() => handleDone(selectedTrip)} // Use selectedTrip.id
      className="bg-green-500 text-white p-2 rounded mr-2"
    >
      Done
    </button>
    <button
      onClick={() =>handleRejected(selectedTrip)}
      className="bg-red-500 text-white p-2 rounded mr-2"
    >
      Rejected
    </button>
    <button
      onClick={() => closeModal()}
      className="bg-gray-500 text-white p-2 rounded"
    >
      Cancel
    </button>
  </div>
</Modal>



    </div>
  );
}

export default Banking;