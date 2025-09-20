import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CompanyApplications.css';

const CompanyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData"));
    if (storedUser) {
      fetch(`http://15.206.41.13:8085/api/auth/company/${storedUser.userId}/applications`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Applications not found');
          }
          return res.json();
        })
        .then(data => {
          setApplications(Array.isArray(data) ? data : []);
          setError('');
        })
        .catch(err => {
          console.error("Error fetching applications:", err);
          setError('Failed to load applications');
          setApplications([]);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const goBack = () => navigate('/companyDashboard');

  if (loading) {
    return (
      <div className="applications-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="applications-container">
      {/* Background elements */}
      <div className="background-container">
        <div className="background-image"></div>
        <div className="background-overlay"></div>
      </div>

      {/* Main content */}
      <div className="applications-content">
        {/* Professional header */}
        <header className="applications-header">
          <div className="header-content">
            <button onClick={goBack} className="back-button">
              ← Back to Dashboard
            </button>
            <div className="header-title">
              <h1>Job Applications</h1>
              <p>Manage and review all candidate applications</p>
            </div>
          </div>
        </header>

        {error && (
          <div className="error-message">
            <div className="error-icon">⚠️</div>
            {error}
          </div>
        )}

        {/* Applications list */}
        <div className="applications-main">
          <div className="applications-list">
            {applications.length === 0 ? (
              <div className="no-applications">
                <h2>No Applications Yet</h2>
                <p>Applications will appear here when candidates apply to your jobs</p>
              </div>
            ) : (
              applications.map((application, index) => (
                <div key={application.id || index} className="application-card">
                  <h3>{application.fullName}</h3>
                  <div className="application-details">
                    <p><strong>Email:</strong> {application.email}</p>
                    <p><strong>Mobile:</strong> {application.mobile}</p>
                    <p><strong>Skills:</strong> {application.skills}</p>
                    <p><strong>Experience:</strong> {application.fresherOrExp}</p>
                    
                    {application.fresherOrExp === 'Experience' && (
                      <>
                        <p><strong>Previous Company:</strong> {application.companyName}</p>
                        <p><strong>Role:</strong> {application.role}</p>
                        <p><strong>Years of Experience:</strong> {application.yearsOfExperience}</p>
                        <p><strong>Previous Package:</strong> {application.previousPackage}</p>
                      </>
                    )}
                    
                    <p><strong>Expected Package:</strong> {application.expectedPackage}</p>
                    <p><strong>Description:</strong> {application.description}</p>
                    
                    {application.resumePath && (
                      <a 
                        href={`http://15.206.41.13:8085/api/auth/resume/${application.id}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="resume-link"
                      >
                        📄 View Resume
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyApplications;