import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Forgot.css"

const ForgotPassword = () => {
  const [form, setForm] = useState({
    email: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value
    });
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://15.206.41.13:8085/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.text();

      if (response.ok) {
        setMessage(data);
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
      } else {
        setError(data);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="forgot-container">
      {/* Header */}
      <header className="forgot-header">
        <div className="forgot-logo">
          <a href="/">
            <img src="logo-website.png" alt="Company Logo" />
          </a>
          <h1>Career Spott</h1>
        </div>
      </header>

      {/* Main Layout */}
      <div className="forgot-section">
        <div className="forgot-box">
        {/* Left: Form */}
        <div className="forgot-form">
          <h2>Reset Password</h2>
          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}

          <form onSubmit={handleSubmit}>
            <label>Email Id:</label>
            <input
              type="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />

            <label>New Password:</label>
              <div className="password-input-container">
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="New Password"
                  required
                />
                <button 
                  type="button"
                  className="password-toggle-icon"
                  onClick={toggleNewPasswordVisibility}
                >
                  {showNewPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>

              <label>Confirm Password:</label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  required
                />
                <button 
                  type="button"
                  className="password-toggle-icon"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>

            <button type="submit">Reset Password</button>
          </form>

          <div className="forgot-redirect">
            <p>
              Remember your password?<a href="/signin">Sign In</a>
            </p>
          </div>
        </div>

        {/* Right: Image */}
        <div className="forgot-image">
          <img src="animation-5.png" alt="Illustration" />
        </div>
      </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
