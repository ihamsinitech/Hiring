import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CompanyApplications.css';

const CompanyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [showResponseModal, setShowResponseModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = () => {
    const storedUser = JSON.parse(localStorage.getItem("userData"));
    if (storedUser) {
      console.log("Fetching applications for company:", storedUser.userId);
      fetch(`http://15.206.41.13:8085/api/auth/company/${storedUser.userId}/applications`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Applications not found');
          }
          return res.json();
        })
        .then(data => {
          console.log("Applications data:", data);
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
  };

  const goBack = () => navigate('/companyDashboard');

  const handleRespond = (application) => {
    setSelectedApplication(application);
    setResponseMessage('');
    setShowResponseModal(true);
  };

  const handleShortlist = (application) => {
    const storedUser = JSON.parse(localStorage.getItem("userData"));
    
    fetch(`http://15.206.41.13:8085/api/auth/application/${application.id}/respond`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Congratulations! Your application for ${application.jobTitle || 'the position'} has been shortlisted. We will contact you soon for the next steps.`,
        companyName: storedUser.companyName || 'Our Company',
        actionType: 'SHORTLIST' 
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('Application shortlisted successfully!');
        fetchApplications(); // Refresh the list
      } else {
        alert('Error: ' + data.message);
      }
    })
    .catch(err => {
      console.error('Error shortlisting:', err);
      alert('Error shortlisting application');
    });
  };

  const sendResponse = () => {
    if (!responseMessage.trim()) {
      alert('Please enter a response message');
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("userData"));
    
    fetch(`http://15.206.41.13:8085/api/auth/application/${selectedApplication.id}/respond`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: responseMessage,
        companyName: storedUser.companyName || 'Our Company',
        actionType: 'RESPONSE' 
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('Response sent successfully!');
        setShowResponseModal(false);
        setSelectedApplication(null);
        setResponseMessage('');
        fetchApplications(); // Refresh the list
      } else {
        alert('Error: ' + data.message);
      }
    })
    .catch(err => {
      console.error('Error sending response:', err);
      alert('Error sending response');
    });
  };

  const downloadResume = (applicationId) => {
    window.open(`http://15.206.41.13:8085/api/auth/resume/${applicationId}`, '_blank');
  };

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
              <h1>Job Applications ({applications.length})</h1>
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
                  <div className="application-header">
                    <h3>{application.fullName}</h3>
                    <div className="application-status">
                      <span className={`status-badge ${application.status?.toLowerCase() || 'new'}`}>
                        {application.status || 'NEW'}
                      </span>
                    </div>
                  </div>
                  
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
                  </div>

                  {/* Action Buttons */}
                  <div className="application-actions">
                    {application.resumePath && (
                      <button 
                        className="resume-btn"
                        onClick={() => downloadResume(application.id)}
                      >
                        📄 Download Resume
                      </button>
                    )}
                    
                    <button 
                      className="shortlist-btn"
                      onClick={() => handleShortlist(application)}
                      disabled={application.status === 'SHORTLISTED'}
                    >
                      {application.status === 'SHORTLISTED' ? '✅ Shortlisted' : '✅ Shortlist'}
                    </button>
                    
                    <button 
                      className="respond-btn"
                      onClick={() => handleRespond(application)}
                    >
                      💬 Respond
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

     {showResponseModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Respond to {selectedApplication?.fullName}</h3>
            <textarea
              value={responseMessage}
              onChange={(e) => setResponseMessage(e.target.value)}
              placeholder="Enter your response message to the candidate..."
              rows="6"
            />
            <div className="modal-actions">
              <button onClick={() => setShowResponseModal(false)} className="cancel-btn">
                Cancel
              </button>
              <button onClick={sendResponse} className="send-btn">
                Send Response
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyApplications;