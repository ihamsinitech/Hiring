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
      fetchAppliedJobs(userData.userId);

      // ✅ AUTO-REFRESH: Check for status updates every 30 seconds
      const interval = setInterval(() => {
        fetchAppliedJobs(userData.userId);
      }, 30000); // 30 seconds
      
      return () => clearInterval(interval);
    }
  }, []);

  const fetchAppliedJobs = async (studentId) => {
  try {
    setLoading(true);
    console.log('🔍 Frontend: Fetching applied jobs for student:', studentId);
    
    const response = await fetch(`http://localhost:8085/api/auth/student/${studentId}/applied-jobs`);
    
    console.log('📡 Frontend: Main endpoint response status:', response.status);
    
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.text();
        console.error('❌ Frontend: Server error response:', errorData);
        errorMessage += ` - ${errorData}`;
      } catch (e) {
        console.error('❌ Frontend: Could not read error response');
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log('✅ Frontend: Applied Jobs API Response:', data);
    
    if (Array.isArray(data)) {
      console.log('📋 Frontend: First job sample:', data[0]);
      
      // Check if any application status has changed
      const hasStatusChanged = appliedJobs.some((oldJob, index) => {
        const newJob = data[index];
        return newJob && (
          oldJob.viewedByCompany !== newJob.viewedByCompany ||
          oldJob.status !== newJob.status
        );
      });
      
      if (hasStatusChanged) {
        console.log('🔄 Frontend: Application status changes detected');
      }
      
      setAppliedJobs(data);
      console.log('🎯 Frontend: Successfully set applied jobs:', data.length, 'jobs');
    } else {
      console.error('❌ Frontend: Response is not an array:', data);
      setAppliedJobs([]);
    }
    
    setLoading(false);
  } catch (err) {
    console.error("💥 Frontend: Error fetching applied jobs:", err);
    setLoading(false);
    setAppliedJobs([]);
  }
};

  // Get application status for a specific job
  const getApplicationStatus = (job) => {
    if (!job) {
      return { 
        status: 'Applied', 
        viewed: false,
        appliedDate: new Date().toISOString()
      };
    }
    
    return {
      status: job.status || 'Applied',
      viewed: job.viewedByCompany || false,
      viewedAt: job.viewedAt,
      appliedDate: job.appliedDate || new Date().toISOString()
    };
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedJob(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      // Handle different date formats from backend
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.log('Date formatting error:', error);
      return 'N/A';
    }
  };

  if (loading) return <div className="loading">Loading your applied jobs...</div>;

  return (
    <div className="applied-jobs-page">
      <div className="applied-jobs-header">
        <div className="header-content">
          <h1>My Applied Jobs</h1>
          <button className="back-btn" onClick={() => navigate('/jobs')}>
            Back to Jobs
          </button>
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
              {appliedJobs.map(job => {
                const appStatus = getApplicationStatus(job);
                
                return (
                  <div key={job.applicationId || job.id} className="applied-job-card" onClick={() => handleJobClick(job)}>
                    <div className="job-info">
                      <h3>{job.jobTitle || 'No Title'}</h3>
                      <p className="company">{job.companyName || 'Unknown Company'}</p>
                      <p className="location">{job.location || 'Location not specified'}</p>
                      <p className="experience">
                        {job.experienceLevel || 'Not specified'} | {job.salary || 'Salary not specified'}
                      </p>
                      <p className="skills">Skills: {job.skillsRequired || 'Not specified'}</p>
                    </div>
                    
                    <div className="application-status">
                      <div className="status-row">
                        <span className={`status-badge ${appStatus.status.toLowerCase()}`}>
                          {appStatus.status}
                        </span>
                        <span className={`view-status ${appStatus.viewed ? 'viewed' : 'not-viewed'}`}>
                          {appStatus.viewed ? '✓ Viewed by Company' : '⏳ Not Viewed Yet'}
                        </span>
                      </div>
                      
                      <div className="date-info">
                        <span className="applied-date">
                          Applied: {formatDate(appStatus.appliedDate)}
                        </span>
                        {appStatus.viewed && appStatus.viewedAt && (
                          <span className="viewed-date">
                            Viewed: {formatDate(appStatus.viewedAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
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
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="job-detail-section">
                <h3>Company Information</h3>
                <p><strong>Company:</strong> {selectedJob.companyName}</p>
                <p><strong>Location:</strong> {selectedJob.location}</p>
                <p><strong>Experience Required:</strong> {selectedJob.experienceLevel}</p>
                <p><strong>Salary:</strong> {selectedJob.salary}</p>
                <p><strong>Work Mode:</strong> {selectedJob.workMode || 'Not specified'}</p>
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
                  {(() => {
                    const appStatus = getApplicationStatus(selectedJob);
                    return (
                      <>
                        <span className={`status-badge large ${appStatus.status.toLowerCase()}`}>
                          {appStatus.status}
                        </span>
                        <div className="status-details">
                          <p><strong>Applied Date:</strong> {formatDate(appStatus.appliedDate)}</p>
                          <p>
                            <strong>Company View Status:</strong> 
                            <span className={`view-status-detail ${appStatus.viewed ? 'viewed' : 'not-viewed'}`}>
                              {appStatus.viewed ? 
                                `✓ Viewed on ${formatDate(appStatus.viewedAt)}` : 
                                '⏳ Waiting for company to view'}
                            </span>
                          </p>
                          <p><strong>Application ID:</strong> {selectedJob.applicationId || selectedJob.id}</p>
                        </div>
                      </>
                    );
                  })()}
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