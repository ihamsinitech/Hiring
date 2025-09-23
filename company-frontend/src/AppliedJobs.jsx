import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AppliedJobs.css';

const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData && userData.userId) {
      fetch(`http://localhost:8085/api/auth/student/${userData.userId}/applied-jobs`)
        .then(res => res.json())
        .then(data => {
          setAppliedJobs(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching applied jobs:", err);
          setLoading(false);
        });
    }
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="applied-jobs-page">
    
      <div className="applied-jobs-header">
        <div className="header-content">
        <h1>My Applied Jobs</h1>
        <button className="back-btn" onClick={() => navigate('/jobs')}>Back to Jobs</button>
      </div>
      </div>

      <div className="applied-jobs-container">
      <div className="applied-jobs-content">
        {appliedJobs.length === 0 ? (
          <div className="no-applications">
            <h2>You haven't applied to any jobs yet</h2>
            <p>Start applying to jobs and they will appear here</p>
            <button onClick={() => navigate('/jobs')}>Browse Jobs</button>
          </div>
        ) : (
          <div className="applied-jobs-list">
            {appliedJobs.map(job => (
              <div key={job.id} className="applied-job-card">
                <div className="job-info">
                  <h3>{job.jobTitle}</h3>
                  <p className="company">{job.companyName}</p>
                  <p className="location">{job.location}</p>
                  <p className="experience">{job.experienceLevel} | {job.salary}</p>
                  <p className="skills">Skills: {job.skillsRequired}</p>
                </div>
                <div className="application-status">
                  <span className="status-badge">Applied</span>
                  <span className="applied-date">Applied on: {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default AppliedJobs;