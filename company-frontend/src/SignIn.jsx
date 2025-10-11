
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SignIn.css';

const SignIn = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [navigationData, setNavigationData] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value
    });
  };

  // Navigate immediately when animation is shown
  useEffect(() => {
    if (showAnimation && navigationData) {
      // Preload the GIF to ensure it plays smoothly
      const img = new Image();
      img.src = '/istockphoto-1199784477-640-adp-unscreen.gif';
      
      // Navigate after a very short delay to show the animation
      const navigationTimer = setTimeout(() => {
        handleNavigation();
      }, 5000); // Show animation for 2 seconds then navigate

      return () => clearTimeout(navigationTimer);
    }
  }, [showAnimation , navigationData]);

  const handleNavigation = () => {
    if (navigationData) {
      const { redirect } = navigationData;
      navigate(redirect);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8085/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      
      let data;
      try {
        data = await response.json();
      } catch {
        data = { message: "Incorrect email and password" };
      }
      
      if (response.ok) {
        const { redirect, completed, userId, userType } = data;
        const userData = {
          email: form.email,
          userId,
          userType,
          completed
        };
        
        localStorage.setItem('userData', JSON.stringify(userData));

        setNavigationData({
          redirect: redirect
        });

        setShowAnimation(true);
        
      } else {
        setError(data.message || "Incorrect email or password");
      }

    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const skipAnimation = () => {
    handleNavigation();
  };

  return (
    <div className="auth-container">

      {/* Full Screen GIF Overlay */}
      {showAnimation && (
        <div className="fullscreen-gif-overlay">
          <div className="gif-container">
            
            {/* Video Section (Left Side) */}
            <div className="video-section">
              <video
                autoPlay
                muted
                loop
                className="welcome-gif"
                onLoad={() => console.log('Video loaded successfully')}
                onError={() => {
                  console.log('GIF loading error');
                  document.querySelector('.fallback-animation').style.display = 'flex';
                  document.querySelector('.welcome-gif').style.display = 'none';
                }}
              >
                <source src='143765-784138221_small.mp4' type='video/mp4'/>
                  Your browser does not support the video tag.
                  </video>
            </div>


            {/* Message Section (Right Side) */}
            <div className="message-section">
              <div className="glassmorphism-overlay">
                <div className="welcome-message">
                  <div className="welcome-icon">🎉</div>
                  <h1>Welcome to HM Hire!</h1>
                  <p className="welcome-subtitle">Your Career Journey Starts Here</p>
                  <div className="user-greeting">
                    <p>Hello, <span className="user-email">{form.email}</span></p>
                  </div>
                  <div className="welcome-quote">
                    "Your next career opportunity awaits"
                  </div>
                  
                  {/* Continue Button */}
                  <button 
                    className="continue-button"
                    onClick={skipAnimation}
                  >
                    Continue to Dashboard
                  </button>
                </div>
              </div>
            </div>

            {/* Fallback Animation - Hidden by default */}
            <div className="fallback-animation" style={{ display: 'none' }}>
              <div className="animated-content">
                <div className="success-icon">✓</div>
                <h2>Welcome to HM Hire!</h2>
                <p>Successfully signed in. Redirecting...</p>
              </div>
            </div>

          </div>
        </div>
      )}

      <header className="signin-header">
        <div className="signin-logo">
          <a href="/">
            <img src="logo-website.png" alt="Company Logo" />
          </a>
          <h1>HM Hire</h1>
        </div>
      </header>

      <section className="signin-section">
        <div className="signin-wrapper">
          <div className="signin-form">
            <h2>Sign In</h2>
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <label htmlFor="email">Email Id *</label>
              <input 
                type="email" 
                id="email" 
                value={form.email} 
                onChange={handleChange} 
                placeholder="Enter your email" 
                required 
                disabled={loading || showAnimation}
              />
              
              <label htmlFor="password">Password *</label>
              <input 
                type="password" 
                id="password" 
                value={form.password} 
                onChange={handleChange} 
                placeholder="Enter your password" 
                required 
                disabled={loading || showAnimation}
              />
              
              <div className="auth-links">
                <Link to="/forgot-password">Forgot Password?</Link>
              </div>
              
              <button type="submit" disabled={loading || showAnimation}>
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
            
            <div className="auth-redirect">
              <p>Don't have an account? <Link to="/signUp">Sign Up</Link></p>
            </div>
          </div>
          
          <div className="signin-image">
            <img src="animation-3.png" alt="Sign In Illustration" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default SignIn;