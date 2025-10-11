import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AppliedJobs.css';

const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
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

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedJob(null);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="applied-jobs-page">
    
      <div className="applied-jobs-header">
        <div className="header-content">
        <h1>My Applied Jobs</h1>
        <button className="applied-btn" onClick={() => navigate('/jobs')}>Back to Jobs</button>
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
              <div key={job.id} className="applied-job-card" onClick={() => handleJobClick(job)}>
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
    {/* Job Details Modal */}
      {showModal && selectedJob && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedJob.jobTitle}</h2>
          
            </div>
            <div className="modal-body">
              <div className="job-detail-section">
                <h3>Company Information</h3>
                <p><strong>Company:</strong> {selectedJob.companyName}</p>
                <p><strong>Location:</strong> {selectedJob.location}</p>
                <p><strong>Experience Required:</strong> {selectedJob.experienceLevel}</p>
                <p><strong>Salary:</strong> {selectedJob.salary}</p>
              </div>
              
              <div className="job-detail-section">
                <h3>Job Description</h3>
                <p>{selectedJob.jobDescription || "No detailed description available."}</p>
              </div>
              
              <div className="job-detail-section">
                <h3>Skills Required</h3>
                <p>{selectedJob.skillsRequired}</p>
              </div>
              
              <div className="job-detail-section">
                <h3>Application Status</h3>
                <div className="status-info">
                  <span className="status-badge large">Applied</span>
                  <p><b> &emsp; &emsp;Applied Date:</b> {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="close-modal-btn" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppliedJobs;