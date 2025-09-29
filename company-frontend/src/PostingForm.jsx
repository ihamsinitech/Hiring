import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PostingForm.css';

const PostingForm = () => {
  const [form, setForm] = useState({
    jobTitle: '',
    companyName: '',
    jobType: 'Full-time',
    workMode: 'Work from office', 
    location: '',
    salary: '',
    experienceLevel: 'Entry Level',
    educationRequired: 'Bachelor\'s Degree',
    skillsRequired: '',
    jobDescription: '',
    responsibilities: '',
    benefits: '',
    applicationDeadline: '',
    contactEmail: '',
    website: '' ,
    portalLink: ''
  });
  
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm({
      ...form,
      [id]: value
    });
    
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors({
        ...errors,
        [id]: ''
      });
    }
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value;
    setForm({
      ...form,
      skillsRequired: skills
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.jobTitle.trim()) newErrors.jobTitle = 'Job title is required';
    if (!form.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!form.location.trim()) newErrors.location = 'Location is required';
    if (!form.salary.trim()) newErrors.salary = 'Salary information is required';
    if (!form.jobDescription.trim()) newErrors.jobDescription = 'Job description is required';
    if (!form.responsibilities.trim()) newErrors.responsibilities = 'Responsibilities are required';
    if (!form.contactEmail.trim()) newErrors.contactEmail = 'Contact email is required';
    if (form.contactEmail && !/\S+@\S+\.\S+/.test(form.contactEmail)) {
      newErrors.contactEmail = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    try {
    // Get company ID from localStorage
    const storedUser = JSON.parse(localStorage.getItem("userData"));
    const companyId = storedUser?.userId;
    
    console.log("Sending companyId:", companyId); // Debug log
    
    const response = await fetch('http://15.206.41.13:8085/api/auth/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...form,
        companyId: companyId, // ✅ CRITICAL: Add companyId to the request
        companyEmail: form.contactEmail
      }),
    });
    
    const data = await response.json();
    console.log("Server response:", data); // Debug log
    
    if (response.ok) {
      setMessage('Job posted successfully!');
      setTimeout(() => {
        navigate("/welcome", { state: { companyName: form.companyName }});
      }, 1000);
    } else {
      setMessage(data.message || 'Error posting job');
    }
  } catch (err) {
    console.error("Error:", err); // Debug log
    setMessage('An error occurred. Please try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="posting-container">
      <header className="posting-header">
        <div className="posting-logo">
          <a href="/">
            <img src="logo-website.png" alt="Company Logo" />
          </a>
          <h1>Post a Job Opportunity</h1>
        </div>
      </header>

      <div className="posting-page">
      <div className="posting-box">
        {/* Left illustration */}

        <div className="posting-image">
          <img src="animation-9.png" alt="Illustration" />
        </div>

        {/* Right form */}
        <div className="posting-form">
          <h2>Post a Job Opportunity</h2>
          {message && <div className="status">{message}</div>}

          <form onSubmit={handleSubmit}>
            <label>Job Title *</label>
            <input
              type="text"
              id="jobTitle"
              value={form.jobTitle}
              onChange={handleChange}
            />
            {errors.jobTitle && <span>{errors.jobTitle}</span>}

            <label>Company Name *</label>
            <input
              type="text"
              id="companyName"
              value={form.companyName}
              onChange={handleChange}
            />
            {errors.companyName && <span>{errors.companyName}</span>}

            <label>Job Type</label>
            <select id="jobType" value={form.jobType} onChange={handleChange}>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
            </select>

            <label>Work Mode</label>
            <select id="workMode" value={form.workMode} onChange={handleChange}>
              <option>Work from office</option>
              <option>Hybrid</option>
              <option>Remote</option>
            </select>

            <label>Location *</label>
            <input
              type="text"
              id="location"
              value={form.location}
              onChange={handleChange}
            />
            {errors.location && <span>{errors.location}</span>}

            <label>Salary/Rate *</label>
            <input
              type="text"
              id="salary"
              value={form.salary}
              onChange={handleChange}
            />
            {errors.salary && <span>{errors.salary}</span>}

            <label>Experience Level</label>
            <select
              id="experienceLevel"
              value={form.experienceLevel}
              onChange={handleChange}
            >
              <option>Entry Level</option>
              <option>Mid Level</option>
              <option>Senior Level</option>
              <option>Director</option>
              <option>Executive</option>
            </select>

            <label>Education Required *</label>
            <select
              id="educationRequired"
              value={form.educationRequired}
              onChange={handleChange}
              required
            >
              <option>B.Tech</option>
              <option>Associate's Degree</option>
              <option>Bachelor's Degree</option>
              <option>Master's Degree</option>
              <option>PhD</option>
              <option>Others</option>
            </select>

            <label>Skills Required *</label>
            <input
              type="text"
              id="skillsRequired"
              value={form.skillsRequired}
              onChange={handleChange}
              required
            />

            <label>Job Description *</label>
            <textarea
              id="jobDescription"
              value={form.jobDescription}
              onChange={handleChange}
              rows="3"
              required
            />
            {errors.jobDescription && <span>{errors.jobDescription}</span>}

            <label>Responsibilities *</label>
            <textarea
              id="responsibilities"
              value={form.responsibilities}
              onChange={handleChange}
              rows="3"
              required
            />
            {errors.responsibilities && <span>{errors.responsibilities}</span>}

            <label>Benefits *</label>
            <textarea
              id="benefits"
              value={form.benefits}
              onChange={handleChange}
              rows="3"
              required
            />

            <label>Contact Email *</label>
            <input
              type="email"
              id="contactEmail"
              value={form.contactEmail}
              onChange={handleChange}
              required
            />
            {errors.contactEmail && <span>{errors.contactEmail}</span>}

            <label>Company Website *</label>
            <input
              type="url"
              id="website"
              value={form.website}
              onChange={handleChange}
              required
            />

            <label>Company Portal</label>
            <input
              type="url"
              id="portalLink"
              value={form.portalLink}
              onChange={handleChange}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Posting..." : "Post Job Opportunity"}
            </button>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default PostingForm;