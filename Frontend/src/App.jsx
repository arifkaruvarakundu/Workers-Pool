import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loader from './components/Loader';
import AdminDashboard from './pages/Admin/AdminDashboard/AdminDashboard';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import OTPVerification from './pages/OTPVerification';
import UserManagement from './pages/usermanagement';
import ServiceManagement from './pages/service_management';
import Profile_user from './pages/Profile_user';
import { Provider } from 'react-redux';
import store from './Redux/store';
import Add_details from './pages/add_details';
import Services from './pages/services';
import ServiceWorkers from './pages/serviceworkers';
import WorkerDetails from './pages/worker_details';
import BookAppointment from './pages/Book_appointment';
import Worklog_user from './pages/Worklog_user';
import Worklog_worker from './pages/Worklog_worker';
import Userchat from './components/userchat';
import WorkerChat from './components/workerchat';
import Bookings from './pages/Bookings'



function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/OTPVerification" element={<OTPVerification />} />
          <Route path="/Loader" element={<Loader />} />
          <Route path="/users_workers" element={<UserManagement />} />
          <Route path="/service_management" element={<ServiceManagement />} />
          <Route path="/profile_user" element={<Profile_user />} />
          <Route path="/add_details" element={<Add_details />} />
          <Route path="/services" element={<Services />} />
          <Route path="/service/:serviceId" element={<ServiceWorkers />} />
          <Route path="/worker/:workerId" element={<WorkerDetails />} />
          <Route path="/booking/:workerId" element={<BookAppointment />} />
          <Route path="worklog_user/" element={<Worklog_user />} />
          <Route path="/chat/:workerId" element={<Userchat />} />
          <Route path="/workerchat/:userId" element={<WorkerChat />}/>
          <Route path="worklog_worker/" element={<Worklog_worker />} />
          <Route path="/Admin_Dashboard"  element={<AdminDashboard/>}/>
          <Route path="/Bookings"  element={<Bookings />}/>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
