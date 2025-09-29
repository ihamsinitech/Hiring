import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './JobDescription.css';

const JobDescription = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://15.206.41.13:8085/api/auth/${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch job');
        }
        return res.json();
      })
      .then(data => {
        console.log("Job Data from API:", data);
        setJob(data);
      })
      .catch(error => {
        console.error("Error fetching job:", error);
        alert('Error loading job details');
      });
  }, [id]);

  if (!job) return <div className="loading">Loading...</div>;

  return (
    <div className="job-description">
      <header className="jobdescription-header">
        <div className="jobdescription-logo">
          <h1>HM Hire</h1>
          <Link to="/companyDashboard"  className="back-to-dashboard">Back to Dashboard</Link>
        </div>
      </header>
      
      <div className="job-description-card">
        {/* Edit Button - Only visible for company users */}
        <div className="action-buttons">
          <Link to={`/edit/${job.id}`}>
            <button className="edit-btn">Edit Job</button>
          </Link>
          
        </div>
        
        <h2>{job.jobTitle}</h2>
        <p><b>Company:</b> {job.companyName}</p>
        <p><b>Education:</b> {job.educationRequired}</p>
        <p><b>Experience:</b> {job.experienceLevel}</p>
        <p><b>Work Mode:</b> {job.workMode}</p>
        <p><b>Salary:</b> {job.salary}</p>
        <p><b>Location:</b> {job.location}</p>
        <p><b>Contact:</b> {job.contactEmail}</p>
        <p><b>Website:</b> {job.website}</p>

        <h3>Job Description</h3>
        <p>{job.jobDescription}</p>

        <h3>Responsibilities</h3>
        <p>{job.responsibilities}</p>

        <h3>Benefits</h3>
        <p>{job.benefits}</p>

        {/* View Applications Button for Company */}
        <Link to={`/companyApplications`}>
          <button className="view-applications-btn">View Applications</button>
        </Link>
      </div>
    </div>  
  );
};

export default JobDescription;