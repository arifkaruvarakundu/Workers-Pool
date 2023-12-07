import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './Redux/store'; 
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import OTPVerification from './pages/OTPVerification';
import Loader from './components/Loader';
import Profile_user from './pages/Profile_user';
import Add_details from './pages/add_details';
import Worklog_user from './pages/Worklog_user';
import Services from './pages/services';
import ServiceWorkers from './pages/serviceworkers';
import WorkerDetails from './pages/worker_details';
import BookAppointment from './pages/Book_appointment';
import Userchat from './components/userchat';
import WorkerChat from './components/workerchat';
import Worklog_worker from './pages/Worklog_worker';
import UserManagement from './pages/usermanagement';
import ServiceManagement from './pages/service_management';
import AdminDashboard from './pages/Admin/AdminDashboard/AdminDashboard';
import Bookings from './pages/Bookings'; 
import user_wallet from './pages/user_wallet';
import About from './pages/About';
import Contacts from './pages/Contacts';


const isAuthenticated = () => {
  const token = localStorage.getItem('access');
  return token ? true : false;
};

const getUserRole = () => {
  
  const role=localStorage.getItem('user_role')
  
  return role;
};


const ProtectedRoute = ({ element: Element, roles, ...rest }) => {
  const isAuthenticatedUser = isAuthenticated();
  const userRole = getUserRole();
  if (isAuthenticatedUser) {
    if (roles && roles.includes(userRole)) {
      return <Element {...rest} />;
    } else {
      

      return <Navigate to="/" />;
    }
  } else {
    
    return <Navigate to="/signin" />;
  }
};

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/OTPVerification" element={<OTPVerification />} />
          <Route path="/Loader" element={<Loader />} />
          <Route path="/About" element={<About />} />
          <Route path="/Contacts" element={<Contacts />} />

          {/* Protected Routes */}
          <Route path="/profile_user" element={<ProtectedRoute element={Profile_user} roles={['worker', 'user']} />} />
          <Route
            path="/add_details"
            element={<ProtectedRoute element={Add_details} roles={['worker', 'user']} />}
          />
          <Route path="worklog_user/" element={<ProtectedRoute element={Worklog_user} roles={['worker', 'user']}/>} />
          <Route path="user_wallet/" element={<ProtectedRoute element={user_wallet} roles={['worker', 'user']}/>} />
          {/* Public Routes */}
          <Route path="/services" element={<Services />} />
          <Route path="/service/:serviceId" element={<ServiceWorkers />} />
          <Route path="/worker/:workerId" element={<WorkerDetails />} />
          <Route path="/booking/:workerId" element={<BookAppointment />} />

          {/* Protected Routes */}
          <Route path="/chat/:workerId" element={<ProtectedRoute element={Userchat} roles={['worker', 'user']}  />} />
          <Route path="/workerchat/:userId" element={<ProtectedRoute element={WorkerChat} roles={['worker', 'user']} />} />
          <Route path="worklog_worker/" element={<ProtectedRoute element={Worklog_worker} roles={['worker', 'user']}  />} />

          {/* Admin Routes - Requires 'admin' role */}
          <Route
            path="/users_workers"
            element={<ProtectedRoute element={UserManagement} roles={['admin']} />}
          />
          <Route
            path="/service_management"
            element={<ProtectedRoute element={ServiceManagement} roles={['admin']} />}
          />
          <Route
            path="/Admin_Dashboard"
            element={<ProtectedRoute element={AdminDashboard} roles={['admin']} />}
          />
          <Route
            path="/Bookings"
            element={<ProtectedRoute element={Bookings} roles={['admin']} />}
          />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
