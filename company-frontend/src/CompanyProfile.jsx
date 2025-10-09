import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentProfile.css';

const CompanyProfile = () => {
  const [company, setCompany] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [showLogoutAnimation, setShowLogoutAnimation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData && userData.userId) {
      // Fetch company profile
      fetch(`http://15.206.41.13:8085/api/auth/company/${userData.userId}/profile`)
        .then(res => res.json())
        .then(data => {
          setCompany(data);
          setFormData(data);
        })
        .catch(err => console.error("Error fetching company profile:", err));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    fetch(`http://15.206.41.13:8085/api/auth/company/${userData.userId}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(res => res.json())
      .then(data => {
        setCompany(formData);
        setIsEditing(false);
        alert('Profile updated successfully');
      })
      .catch(err => console.error("Error updating profile:", err));
  };

  // ✅ Logout function with animation
  const handleLogout = () => {
    setShowLogoutAnimation(true);
    
    // Wait for animation to play then logout
    setTimeout(() => {
      localStorage.removeItem("userData");
      navigate('/signin');
    }, 3000); // 3 seconds for animation
  };


  if (!company) return <div className="loading">Loading...</div>;

  return (
    <div className="profile-page">

      {/* Full Screen Logout Animation */}
      {showLogoutAnimation && (
        <div className="logout-animation-container">
          <div className="logout-video-overlay">
            <img
              src="/279462295-unscreen (2).gif"
              alt="Logout Animation"
              className="logout-gif"
              onLoad={() => console.log('Logout GIF loaded successfully')}
              onError={() => {
                console.log('GIF loading error');
                // Fallback to direct navigation if GIF fails
                localStorage.removeItem("userData");
                navigate('/signin');
              }}
            />
            
          </div>
        </div>
      )}

      <div className="profile-header">
        <div className="header-content">
          <h1>My Profile</h1>
          <div className="header-buttons">
            <button className="student-btn" onClick={() => navigate('/companyDashboard')}>Back to Dashboard</button>
            <button className="logout-btn" onClick={handleLogout}><i class="fa-solid fa-power-off"></i></button>
          </div>
        </div>
      </div>
      
      <div className="profile-container">
        <div className="profile-content">
          {!isEditing ? (
            <div className="profile-details">
              <div className="profile-card">
                <h2>Company Information</h2>
                <div className="profile-field">
                  <label>Company Name:</label>
                  <span>{company.companyName || 'Not provided'}</span>
                </div>
                <div className="profile-field">
                  <label>Email:</label>
                  <span>{company.email || 'Not provided'}</span>
                </div>
                <div className="profile-field">
                  <label>Mobile:</label>
                  <span>{company.mobile || 'Not provided'}</span>
                </div>
                <div className="profile-field">
                  <label>Address:</label>
                  <span>{company.address || 'Not provided'}</span>
                </div>
              </div>

              <div className="profile-card">
                <h2>Business Statistics</h2>
                <div className="profile-field">
                  <label>Posted Jobs:</label>
                  <span>{company.postedJobsCount || 0}</span>
                </div>
                <div className="profile-field">
                  <label>Total Applications:</label>
                  <span>{company.applicationsCount || 0}</span>
                </div>
                <div className="profile-field">
                  <label>Messages:</label>
                  <span>{company.messagesCount || 0}</span>
                </div>
                <div className="profile-field">
                  <label>Payment Status:</label>
                  <span className={company.paymentStatus === 'Paid' ? 'status-paid' : 'status-pending'}>
                    {company.paymentStatus || 'Pending'}
                  </span>
                </div>
              </div>

              <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
            </div>
          ) : (
            <div className="profile-edit">
              <div className="profile-card">
                <h2>Edit Company Information</h2>
                <div className="form-group">
                  <label>Company Name:</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Mobile:</label>
                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Address:</label>
                  <textarea
                    name="address"
                    value={formData.address || ''}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>
              </div>

              <div className="button-group">
                <button className="save-btn" onClick={handleSave}>Save Changes</button>
                <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;