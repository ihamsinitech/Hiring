import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './JobDetails.css';  // ✅ import styles

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const navigate = useNavigate();

 

  useEffect(() => {
    fetch(`http://localhost:8085/api/auth/${id}`)
      .then(res => res.json())
      .then(data => {
        console.log("Job Data from API:", data); // ✅ Debug check
        setJob(data);
      });
  }, [id]);

  if (!job) return <p>Loading...</p>;

  return (
    <div className="job-details">

      <header className="jobdetails-header">
        <div className="jobdetails-logo">
          <h1>Apply Now</h1>
          <a href="/">&emsp;
            Home
          </a>
        </div>
        </header>
        
      <div className="job-details-card">
        <h2>{job.jobTitle}</h2>
        <p><b>Company:</b> {job.companyName}</p>
        <p><b>Education:</b> {job.educationRequired}</p>
        <p><b>Experience:</b> {job.experienceLevel}</p>
        <p><b>Work Mode:</b>{job.workMode}</p>
        <p><b>Salary:</b> {job.salary}</p>
        <p><b>Location:</b> {job.location}</p>
        <p><b>Contact:</b> {job.contactEmail}</p>
        <p><b>Website:</b> {job.website}</p>

        <h3>Description</h3>
        <p>{job.jobDescription}</p>

        <h3>Responsibilities</h3>
        <p>{job.responsibilities}</p>

        <h3>Benefits</h3>
        <p>{job.benefits}</p>

  {/* ✅ Apply button logic */}
        {job.portalLink && job.portalLink.trim() !== "" ? (
          <a href={job.portalLink} target="_blank" rel="noopener noreferrer">
            <button className="floating-apply-btn">Apply on Company Portal</button>
          </a>
        ) : (
          <Link to={`/apply/${job.id}`}>
            <button className="floating-apply-btn">Apply Here</button>
          </Link>
        )}
   </div>
</div>  

);
};
      

export default JobDetails;
