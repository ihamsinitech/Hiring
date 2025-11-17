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
      fetch(`http://www.careerspott.com/api/auth/company/${storedUser.userId}/applications`)
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

  // ✅ COMBINED FUNCTION: Mark as viewed AND download resume
  const handleResumeDownload = async (applicationId, fullName) => {
    try {
      console.log(`📥 Processing resume for application: ${applicationId}`);
      
      // First mark as viewed
      const viewResponse = await fetch(`http://www.careerspott.com/api/auth/application/${applicationId}/view`, {
        method: 'PUT'
      });
      
      if (viewResponse.ok) {
        console.log('✅ Application marked as viewed:', applicationId);
        
        // Then download the resume
        const resumeUrl = `http://www.careerspott.com/api/auth/resume/${applicationId}`;
        
        // Test if resume exists
        const testResponse = await fetch(resumeUrl);
        if (testResponse.ok) {
          // Open in new tab for download
          window.open(resumeUrl, '_blank');
          alert(`Resume downloaded for ${fullName}! Application marked as viewed.`);
        } else {
          alert(`No resume found for ${fullName}. Application marked as viewed.`);
        }
        
        // Refresh applications to update the viewed status
        fetchApplications();
      } else {
        alert('Error marking application as viewed');
      }
    } catch (error) {
      console.error('Error processing resume:', error);
      alert('Error processing resume download');
    }
  };

  const handleRespond = (application) => {
    setSelectedApplication(application);
    setResponseMessage('');
    setShowResponseModal(true);
  };

  const handleShortlist = (application) => {
    const storedUser = JSON.parse(localStorage.getItem("userData"));
    
    fetch(`http://www.careerspott.com/api/auth/application/${application.id}/respond`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Congratulations! Your application for the position has been shortlisted. We will contact you soon for the next steps.`,
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
    
    fetch(`http://www.careerspott.com/api/auth/application/${selectedApplication.id}/respond`, {
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

  // ✅ IMPROVED Helper function to check if a field has value
  const hasValue = (value) => {
    return value !== null && value !== undefined && value !== '' && value !== ' ' && !value.toString().toLowerCase().includes('not');
  };

  // ✅ Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  // ✅ NEW FUNCTION: Check if any experience fields are filled
  const hasExperienceData = (application) => {
    return hasValue(application.companyName) || 
           hasValue(application.role) || 
           hasValue(application.yearsOfExperience) || 
           hasValue(application.previousPackage) || 
           hasValue(application.expectedPackage);
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
                    <h3>{application.fullName || 'No Name Provided'}</h3>
                    <div className="application-status">
                      <span className={`status-badge ${application.status?.toLowerCase() || 'new'}`}>
                        {application.status || 'NEW'}
                      </span>
                      {!application.viewedByCompany && (
                        <span className="status-badge new">UNVIEWED</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="application-details">
                    {/* ✅ COMMON FIELDS - Only show if they have values */}
                    <div className="field-group">
                      <h4>Basic Information</h4>
                      {hasValue(application.email) && (
                        <p><strong>Email:</strong> {application.email}</p>
                      )}
                      {hasValue(application.mobile) && (
                        <p><strong>Mobile:</strong> {application.mobile}</p>
                      )}
                      {hasValue(application.skills) && (
                        <p><strong>Skills:</strong> {application.skills}</p>
                      )}
                      {hasValue(application.fresherOrExp) && (
                        <p><strong>Experience Level:</strong> {application.fresherOrExp}</p>
                      )}
                    </div>

                    {/* ✅ EXPERIENCE FIELDS - Only show if applicant is experienced AND has experience data */}
                    {application.fresherOrExp === 'Experienced' && hasExperienceData(application) && (
                      <div className="field-group">
                        <h4>Experience Details</h4>
                        {hasValue(application.companyName) && (
                          <p><strong>Previous Company:</strong> {application.companyName}</p>
                        )}
                        {hasValue(application.role) && (
                          <p><strong>Role:</strong> {application.role}</p>
                        )}
                        {hasValue(application.yearsOfExperience) && (
                          <p><strong>Years of Experience:</strong> {application.yearsOfExperience}</p>
                        )}
                        {hasValue(application.previousPackage) && (
                          <p><strong>Previous Package:</strong> {application.previousPackage}</p>
                        )}
                        {hasValue(application.expectedPackage) && (
                          <p><strong>Expected Package:</strong> {application.expectedPackage}</p>
                        )}
                      </div>
                    )}

                    {/* ✅ ADDITIONAL INFORMATION - Only show if description exists */}
                    {hasValue(application.description) && (
                      <div className="field-group">
                        <h4>Additional Information</h4>
                        <p><strong>Description:</strong> {application.description}</p>
                      </div>
                    )}

                    {/* ✅ APPLICATION METADATA - Always show */}
                    <div className="field-group">
                      <h4>Application Details</h4>
                      <p><strong>Applied Date:</strong> {formatDate(application.appliedDate)}</p>
                      
                      {application.viewedAt && (
                        <p><strong>Viewed At:</strong> {formatDate(application.viewedAt)}</p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="application-actions">
                    {/* ✅ SINGLE BUTTON: Download Resume + Mark as Viewed */}
                    <button 
                      className="resume-btn"
                      onClick={() => handleResumeDownload(application.id, application.fullName)}
                    >
                      {application.viewedByCompany ? '📄 Download Resume' : '📄 Download Resume & Mark Viewed'}
                    </button>
                    
                    {/* Shortlist Button */}
                    <button 
                      className="shortlist-btn"
                      onClick={() => handleShortlist(application)}
                      disabled={application.status === 'SHORTLISTED'}
                    >
                      {application.status === 'SHORTLISTED' ? '✅ Shortlisted' : '✅ Shortlist'}
                    </button>
                    
                    {/* Respond Button */}
                    <button 
                      className="respond-btn"
                      onClick={() => handleRespond(application)}
                    >
                       Respond
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