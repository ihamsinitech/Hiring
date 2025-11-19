import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CompanyRegistration.css';

const CompanyRegistration = () => {
  const [form, setForm] = useState({
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [trialInfo, setTrialInfo] = useState(null);
  const navigate = useNavigate();

  // Toggle password visibility functions - MOVED OUTSIDE handleChange
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm({
      ...form,
      [id]: value
    });
    
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors({
        ...errors,
        [id]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!form.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    }
    
    if (!form.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const register = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setErrors({});
    setMessage('');
    setLoading(true);
    
    try {
      const response = await fetch('https://www.careerspott.com/api/auth/signup/company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: form.companyName,
          email: form.email,
          password: form.password,
          confirmPassword: form.confirmPassword,
          mobile: form.mobile,
          address: form.address
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage(data.message);
        setTrialInfo({
          trialEndDate: data.trialEndDate,
          message: `30-day free trial until ${new Date(data.trialEndDate).toLocaleDateString()}`
        });
        
        setTimeout(() => {
          navigate('/signin');
        }, 3000);
      } else {
        setErrors({ submit: data });
      }
    } catch (err) {
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="company-container">
      <header className="company-header">
        <div className="company-logo">
          <a href="/">
            <img src="logo-website.png" alt="Company Logo" />
          </a>
          <h1>Career Spott</h1>
        </div>
      </header>

      <div className="company-section">
        <div className="company-box">

          {/* Left Image */}
          <div className="company-image">
            <img src="animation-12.png" alt="Illustration" />
          </div>

          {/* Right Content */}
          <div className="company-form">
            <h2>Company Registration Form</h2>

            {trialInfo && (
              <div className="company-trial-box">
                <h3>🎁 Free Trial Activated!</h3>
                <p>{trialInfo.message}</p>
                <small>After trial period, payment will be required to continue using our services</small>
              </div>
            )}

            {errors.submit && <div className="error">{errors.submit}</div>}
            {message && <div className="success">{message}</div>}

            <form onSubmit={register}>
              <label>Company Name *</label>
              <input
                type="text"
                id="companyName"
                value={form.companyName}
                onChange={handleChange}
                placeholder="Company Name"
                className={errors.companyName ? 'error' : ''}
              />
              {errors.companyName && <div className="error-message">{errors.companyName}</div>}

              <label>Company Email Id *</label>
              <input
                type="email"
                id="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <div className="error-message">{errors.email}</div>}

              <label>Password *</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className={errors.password ? 'error' : ''}
                />
                <button 
                  type="button"
                  className="password-toggle-icon"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <i className="fa-solid fa-eye"></i> : <i className="fa-solid fa-eye-slash"></i>}
                </button>
              </div>
              {errors.password && <div className="error-message">{errors.password}</div>}

              <label>Confirm Password *</label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className={errors.confirmPassword ? 'error' : ''}
                />
                <button 
                  type="button"
                  className="password-toggle-icon"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? <i className="fa-solid fa-eye"></i> : <i className="fa-solid fa-eye-slash"></i>}
                </button>
              </div>
              {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}

              <label>Mobile *</label>
              <input
                type="text"
                id="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="Mobile"
                className={errors.mobile ? 'error' : ''}
              />
              {errors.mobile && <div className="error-message">{errors.mobile}</div>}

              <label>Address *</label>
              <textarea
                id="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Address"
                className={errors.address ? 'error' : ''}
              />
              {errors.address && <div className="error-message">{errors.address}</div>}

              <p className="company-terms">
                By registering, you agree to our 30-day free trial. After the trial period,
                you'll need to subscribe to continue using our services.
              </p>

              <button type="submit" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyRegistration;