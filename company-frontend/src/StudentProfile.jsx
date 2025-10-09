import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentProfile.css';

const Profile = () => {
  const [student, setStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [showLogoutAnimation, setShowLogoutAnimation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData && userData.userId) {
      // First get the basic profile with stats
      fetch(`http://15.206.41.13:8085/api/auth/student/${userData.userId}/profile`)
        .then(res => res.json())
        .then(data => {
          setStudent(data);
          setFormData(data);
          })
        .catch(err => console.error("Error fetching profile:", err));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    fetch(`http://15.206.41.13:8085/api/auth/student/${userData.userId}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(res => res.json())
      .then(data => {
        setStudent(formData);
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

  if (!student) return <div className="loading">Loading...</div>;

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
            <button className="student-btn" onClick={() => navigate('/jobs')}>Back to Jobs</button>
            <button className="logout-btn" onClick={handleLogout}>
              <b><i className="fa-solid fa-power-off"></i></b>
            </button>
          </div>
        </div>
      </div>
      
      <div className="profile-container">
        <div className="profile-content">
          {!isEditing ? (
            <div className="profile-details">
              <div className="profile-card">
                <h2>Personal Information</h2>
                <div className="profile-field">
                  <label>Full Name:</label>
                  <span>{student.fullName || 'Not provided'}</span>
                </div>
                <div className="profile-field">
                  <label>Email:</label>
                  <span>{student.email || 'Not provided'}</span>
                </div>
                <div className="profile-field">
                  <label>Mobile:</label>
                  <span>{student.mobile || 'Not provided'}</span>
                </div>
              </div>

              <div className="profile-card">
                <h2>Education Details</h2>
                <div className="profile-field">
                  <label>Education:</label>
                  <span>{student.education || 'Not provided'}</span>
                </div>
                <div className="profile-field">
                  <label>Year of Passing:</label>
                  <span>{student.yearOfPassing || 'Not provided'}</span>
                </div>
                <div className="profile-field">
                  <label>Location:</label>
                  <span>{student.place || 'Not provided'}</span>
                </div>
              </div>

              {student.status === 'Experience' && (
                <div className="profile-card">
                  <h2>Work Experience</h2>
                  <div className="profile-field">
                    <label>Company Name:</label>
                    <span>{student.companyName || 'Not provided'}</span>
                  </div>
                  <div className="profile-field">
                    <label>Years of Experience:</label>
                    <span>{student.yearsOfExp || 'Not provided'}</span>
                  </div>
                  <div className="profile-field">
                    <label>Role:</label>
                    <span>{student.role || 'Not provided'}</span>
                  </div>
                </div>
              )}

              <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
            </div>
          ) : (
            <div className="profile-edit">
              <div className="profile-card">
                <h2>Edit Personal Information</h2>
                <div className="form-group">
                  <label>Full Name:</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName || ''}
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
              </div>

              <div className="profile-card">
                <h2>Edit Education Details</h2>
                <div className="form-group">
                  <label>Education:</label>
                  <input
                    type="text"
                    name="education"
                    value={formData.education || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Year of Passing:</label>
                  <input
                    type="text"
                    name="yearOfPassing"
                    value={formData.yearOfPassing || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Location:</label>
                  <input
                    type="text"
                    name="place"
                    value={formData.place || ''}
                    onChange={handleInputChange}
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

export default Profile;