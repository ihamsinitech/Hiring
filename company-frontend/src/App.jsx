import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import Home from './Home';
import SignIn from './SignIn';
import ForgotPassword from './ForgotPassword';
import StudentRegistration from './StudentRegistration';
import CompanyRegistration from './CompanyRegistration';
import SignUp from './SignUp';
import PostingForm from './PostingForm';
import JobList from './JobList';
import JobDetails from './JobDetails';
import WelcomePage from './WelcomePage';
import ApplicationForm from './ApplicationForm';
import SuccessPage from './SuccessPage';
import StudentSuccessPage from './StudentSuccessPage';
import StudentProfile from './StudentProfile';
import AppliedJobs from './AppliedJobs';
import Messages from './Messages';
import ShortlistedJobs from './ShortlistedJobs';
import CompanyDashboard from './CompanyDashboard';





function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/student-registration" element={<StudentRegistration />} />
          <Route path="/companyRegistration" element={<CompanyRegistration />} />
          <Route path="/postingForm" element={<PostingForm />} />
          <Route path="/jobs" element={<JobList />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/apply/:id" element={<ApplicationForm />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/student-success" element={<StudentSuccessPage/>} />
          <Route path="/profile" element={<StudentProfile />} />
          <Route path="/applied-jobs" element={<AppliedJobs />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/shortlisted" element={<ShortlistedJobs />} />
        
        </Routes>
      </div>
    </Router>
  );
}

export default App;