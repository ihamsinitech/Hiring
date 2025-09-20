import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ShortlistedJobs.css';

const ShortlistedJobs = () => {
  const [shortlistedJobs, setShortlistedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData && userData.userId) {
      fetch(`http://15.206.41.13:8085/api/auth/student/${userData.userId}/shortlisted-jobs`)
        .then(res => res.json())
        .then(data => {
          setShortlistedJobs(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching shortlisted jobs:", err);
          setLoading(false);
        });
    }
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="shortlisted-jobs-page">
      {/* Full width header */}
      <div className="shortlisted-jobs-header">
        <div className="header-content">
          <h1>Shortlisted Jobs</h1>
          <button className="back-btn" onClick={() => navigate('/jobs')}>Back to Jobs</button>
        </div>
      </div>

      {/* Centered content container */}
      <div className="shortlisted-jobs-container">
        <div className="shortlisted-jobs-content">
          {shortlistedJobs.length === 0 ? (
            <div className="no-shortlisted">
              <h2>No shortlisted jobs yet</h2>
              <p>Keep applying to jobs and companies will shortlist your profile</p>
              <button onClick={() => navigate('/jobs')}>Browse Jobs</button>
            </div>
          ) : (
            <div className="shortlisted-jobs-list">
              {shortlistedJobs.map(job => (
                <div key={job.id} className="shortlisted-job-card">
                  <div className="job-info">
                    <h3>{job.jobTitle}</h3>
                    <p className="company">{job.companyName}</p>
                    <p className="location">{job.location}</p>
                    <p className="experience">{job.experienceLevel} | {job.salary}</p>
                    <p className="skills">Skills: {job.skillsRequired}</p>
                  </div>
                  <div className="application-status">
                    <span className="status-badge shortlisted">Shortlisted</span>
                    <span className="shortlisted-date">Shortlisted on: {new Date().toLocaleDateString()}</span>
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

export default ShortlistedJobs;