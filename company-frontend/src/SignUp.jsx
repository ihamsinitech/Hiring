import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SignUp.css';

const SignUp = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVideoMessage, setShowVideoMessage] = useState(false);
  const [successUsername, setSuccessUsername] = useState('');
  
  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm({
      ...form,
      [id]: id === 'fullName' ? value.toUpperCase() : value
    });
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    // Password validation
    const hasLowerCase = /[a-z]/.test(form.password);
    const hasUpperCase = /[A-Z]/.test(form.password);
    const hasNumber = /[0-9]/.test(form.password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(form.password);
    
    if (!hasLowerCase || !hasUpperCase || !hasNumber || !hasSpecialChar) {
      setError('Password must contain lowercase, uppercase, number, and special character');
      setLoading(false);
      return;
    }
    
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch('http://localhost:8085/api/auth/signup/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          confirmPassword: form.confirmPassword
        }),
      });
      
      const data = await response.text();
      
      if (response.ok) {
        setSuccessUsername(form.fullName);
        setShowVideoMessage(true);

        // Navigate to signin after video message
        setTimeout(() => {
          navigate('/student-registration');
        }, 5000);
       
      } else {
        setError(data || 'Registration failed');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
      console.error('Error details:', err);

    } finally {
      setLoading(false);
    }
  };

  const skipVideo = () => {
    navigate('/student-registration');
  };

  return (
    <div className="signup-container">

      {/* Full Screen Video Message after Success */}
      {showVideoMessage && (
        <div className="fullscreen-success-container">
          {/* Animation Header */}
          <header className="animation-header">
            <div className="animation-logo">
              <img src="logo-website.png" alt="Career Spott Logo" />
              <h1>Career Spott</h1>
            </div>
          </header>

          {/* Full Screen Video Background */}
          <div className="fullscreen-video-background">
            <video
              autoPlay
              muted
              loop
              className="fullscreen-video"
              onLoadedData={() => console.log('Video loaded successfully')}
              onError={(e) => {
                console.log('Video loading error', e);
                setTimeout(() => navigate('/student-registration'), 2000);
              }}
            >
              <source src='/istockphoto-1371124982-640_adpp_is.mp4' type='video/mp4'/>
              Your browser does not support the video tag.
            </video>
            <div className="video-overlay"></div>
          </div>

          {/* Glass Message Panel on Right Side */}
          <div className="right-glass-message-panel">
            <div className="message-content">
              <div className="success-icon">🎉</div>
              <h2>Hello, {successUsername}!</h2>
              <p className="welcome-message">Welcome to Career Spott</p>
              
              <div className="success-card">
                <p className="success-main">Successfully created account!</p>
                <p className="signin-instruction">Please Sign In</p>
              </div>

              <button className="continue-btn" onClick={skipVideo}>
                Continue to Registration
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="signup-header">
        <div className="signup-logo">
          <a href="/">
            <img src="logo-website.png" alt="Company Logo" />
          </a>
          <h1>Career Spott</h1>
        </div>
      </header>

      <section className="signup-section">
        <div className="signup-wrapper">
          <div className="signup-image">
            <img src="annimation-15.png" alt="Sign Up" />
          </div>
         
          <div className="signup-form">
            <h2>Create Account</h2>
            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}
            
            <form onSubmit={handleSubmit}>
              <label>Full Name *</label>
              <input 
                type="text" 
                id="fullName" 
                value={form.fullName} 
                onChange={handleChange} 
                placeholder="Full Name" 
                style={{ textTransform: "uppercase" }}
                required 
                disabled={loading}
              />
              
              <label>Email Id *</label>
              <input 
                type="email" 
                id="email" 
                value={form.email} 
                onChange={handleChange} 
                placeholder="Email" 
                required 
                disabled={loading}
              />
              
              {/* Password Field with ALWAYS VISIBLE toggle icon */}
              <label>Password *</label>
              <div className="password-input-container">
                <input 
                  type={showPassword ? "text" : "password"}
                  id="password" 
                  value={form.password} 
                  onChange={handleChange} 
                  placeholder="Password" 
                  required 
                  disabled={loading}
                />
                <button 
                  type="button"
                  className="password-toggle-icon"
                  onClick={togglePasswordVisibility}
                  tabIndex="-1"
                >
                  {showPassword ?  '👁️' :'👁️‍🗨️' }
                </button>
              </div>
              <div className="password-requirements">
                Password must contain a lowercase, uppercase, number, and special character.
              </div>
              
              {/* Confirm Password Field with ALWAYS VISIBLE toggle icon */}
              <label>Confirm Password *</label>
              <div className="password-input-container">
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword" 
                  value={form.confirmPassword} 
                  onChange={handleChange} 
                  placeholder="Confirm Password" 
                  required 
                  disabled={loading}
                />
                <button 
                  type="button"
                  className="password-toggle-icon"
                  onClick={toggleConfirmPasswordVisibility}
                  tabIndex="-1"
                >
                  {showConfirmPassword ? <i class="fa-solid fa-eye"></i> : <i class="fa-solid fa-eye-slash"></i> }
                </button>
              </div>
              
              <button type="submit" disabled={loading}>
                {loading ? 'Processing...' : 'Sign Up'}
              </button>
            </form>
            
            <div className="auth-redirect">
              <p>Already have an account? <Link to="/signin">Sign In</Link></p>
            </div>
          </div>
        </div> 
      </section>
    </div>
  );
};

export default SignUp;