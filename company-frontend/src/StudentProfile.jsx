import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentProfile.css';

// Enhanced Logout Animation Component with Side-by-Side Layout
const LogoutAnimation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to signin page after 3 seconds
    const timer = setTimeout(() => {
      navigate('/signin');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="logout-animation-page">
      {/* Header with Logo and Career Spott */}
      <div className="animation-header">
        <div className="animation-header-content">
          <div className="animation-logo">
            <div className="logo-icon">
              <a href="/signin">
                <img src="logo-website.png" alt="Company Logo" />
              </a>
            </div>
            <span className="company-name">Career Spott</span>
          </div>
        </div>
      </div>

      <div className="animation-overlay"></div>
      
      {/* Main Content Container */}
      <div className="animation-main-container">
        {/* Left Side - Image */}
        <div className="animation-image-section">
          <img 
            src='animation-24.png' 
            alt="Goodbye Animation"
            className="animation-side-image"
          />
        </div>

        {/* Right Side - Glass Card Message */}
        <div className="animation-message-section">
          <div className="animation-glass-card">
            <div className="animation-content">
              <div className="bye-text bye-above">👋</div>
              <div className="thank-you-text">Thank You for Visiting!</div>
              <div className="visitor-counter">See you soon!</div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [showAnimation, setShowAnimation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData && userData.userId) {
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

  // ✅ Updated Logout function with animation
  const handleLogout = () => {
    setShowAnimation(true);
    setTimeout(() => {
      localStorage.removeItem("userData");
    }, 1000);
  };

  // If animation is shown, render the animation component
  if (showAnimation) {
    return <LogoutAnimation />;
  }

  if (!student) return <div className="loading">Loading...</div>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="header-content">
          <h1>My Profile</h1>
          <div className="header-buttons">
            <button className="student-btn" onClick={() => navigate('/jobs')}>Back to Jobs</button>
            <button className="logout-btn" onClick={handleLogout}><b><i className="fa-solid fa-power-off"></i></b></button>
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

export default StudentProfile;