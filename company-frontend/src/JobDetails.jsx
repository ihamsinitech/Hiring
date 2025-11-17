import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './JobDetails.css';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [user, setUser] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Load user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData"));
    if (storedUser) {
      setUser(storedUser);
      fetchAppliedJobs(storedUser.userId);
    }
  }, []);

  // ✅ Fetch applied jobs for the student
  const fetchAppliedJobs = (studentId) => {
    fetch(`http://www.careerspott.com/api/auth/student/${studentId}/applied-jobs`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch applied jobs');
        }
        return res.json();
      })
      .then(data => {
        const appliedJobIds = data.map(job => job.id || job.jobId);
        setAppliedJobs(appliedJobIds);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching applied jobs:", err);
        setAppliedJobs([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetch(`http://www.careerspott.com/api/auth/${id}`)
      .then(res => res.json())
      .then(data => {
        console.log("Job Data from API:", data);
        setJob(data);
      });
  }, [id]);

  // ✅ Check if job is applied
  const isJobApplied = () => {
    return appliedJobs.includes(job?.id);
  };

  // ✅ Handle apply button click - Navigate to ApplicationForm
  const handleApplyClick = (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please login to apply for jobs');
      navigate('/login');
      return;
    }

    if (isJobApplied()) {
      alert('You have already applied for this job');
      return;
    }

    // Navigate to ApplicationForm page instead of applying directly
    navigate(`/apply/${id}`);
  };

  if (!job || loading) return <div className="loading">Loading...</div>;

  const hasApplied = isJobApplied();

  return (
    <div className="job-details">
      <header className="jobdetails-header">
        <div className="jobdetails-logo">
          <h1>Career Spott</h1>
          <a href="/jobs">&emsp;Home</a>
        </div>
      </header>
      
      <div className="job-details-card">
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

        {/* ✅ Apply button logic */}
        {hasApplied ? (
          <button className='floating-apply-btn applied' disabled>
            ✓ Applied
          </button>
        ) : job.portalLink && job.portalLink.trim() !== "" ? (
          <a href={job.portalLink} target="_blank" rel="noopener noreferrer">
            <button className="floating-apply-btn">Apply on Company Portal</button>
          </a>
        ) : (
          <button 
            className="floating-apply-btn" 
            onClick={handleApplyClick}
          >
            Apply Now
          </button>
        )}
      </div>
    </div>  
  );
};

export default JobDetails;