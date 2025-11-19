import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditJob.css';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState({
    jobTitle: '',
    companyName: '',
    educationRequired: '',
    experienceLevel: '',
    workMode: '',
    salary: '',
    location: '',
    contactEmail: '',
    website: '',
    jobDescription: '',
    responsibilities: '',
    benefits: '',
    portalLink: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`https://www.careerspott.com/api/auth/${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch job');
        }
        return res.json();
      })
      .then(data => {
        setJob(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching job:', error);
        setError('Failed to load job details');
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob(prevJob => ({
      ...prevJob,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`https://www.careerspott.com/api/auth/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(job)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to update job');
      }

      const data = await response.json();
      console.log('Success:', data);
      navigate(`/company/job/${id}`); // Redirect back to job details
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to update job: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="edit-job-container">
      <header className="edit-header">
        <div className="edit-logo">
          <h1>Edit Job</h1>
          <button onClick={() => navigate(-1)}>Back</button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="edit-job-form">
        <div className="form-group">
          <label>Job Title:</label>
          <input
            type="text"
            name="jobTitle"
            value={job.jobTitle || ''}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Company Name:</label>
          <input
            type="text"
            name="companyName"
            value={job.companyName || ''}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Education Required:</label>
          <input
            type="text"
            name="educationRequired"
            value={job.educationRequired || ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Experience Level:</label>
          <input
            type="text"
            name="experienceLevel"
            value={job.experienceLevel || ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Work Mode:</label>
          <input
            type="text"
            name="workMode"
            value={job.workMode || ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Salary:</label>
          <input
            type="text"
            name="salary"
            value={job.salary || ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={job.location || ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Contact Email:</label>
          <input
            type="email"
            name="contactEmail"
            value={job.contactEmail || ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Website:</label>
          <input
            type="text"
            name="website"
            value={job.website || ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Job Description:</label>
          <textarea
            name="jobDescription"
            value={job.jobDescription || ''}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Responsibilities:</label>
          <textarea
            name="responsibilities"
            value={job.responsibilities || ''}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Benefits:</label>
          <textarea
            name="benefits"
            value={job.benefits || ''}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Portal Link (optional):</label>
          <input
            type="text"
            name="portalLink"
            value={job.portalLink || ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-buttons">
          <button 
            type="submit" 
            className="save-btn"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button 
            type="button" 
            onClick={() => navigate(-1)} 
            className="cancel-btn"
            disabled={saving}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditJob;