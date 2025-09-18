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
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm({
      ...form,
      [id]: id === 'fullName' ? value.toUpperCase() : value
    });
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
      const response = await fetch('http://15.206.41.13:8085/api/auth/signup/student', {
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
        setMessage('Registration successful! Redirecting to sign in...');
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
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

  return (
    <div className="signup-container">
      <header className="signup-header">
        <div className="signup-logo">
          <a href="/">
            <img src="logo-website.png" alt="Company Logo" />
          </a>
          <h1>Student Sign Up</h1>
        </div>
      </header>

      <section className="signup-section">
        <div className="signup-wrapper">
          {/* Left side image */}
          <div className="signup-image">
            <img src="annimation-15.png" alt="Sign Up" />
          </div>
         
        <div className="signup-form">
          <h2>Create Account</h2>
          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}
          
          <form onSubmit={handleSubmit}>
            <label>Full Name:</label>
            <input 
              type="text" 
              id="fullName" 
              value={form.fullName} 
              onChange={handleChange} 
              placeholder="Full Name" 
              style={{ textTransform: "uppercase" }}
              required 
              disabled={loading} // Disable during loading
            />
            
            <label>Email Id:</label>
            <input 
              type="email" 
              id="email" 
              value={form.email} 
              onChange={handleChange} 
              placeholder="Email" 
              required 
              disabled={loading} // Disable during loading
            />
            
            <label>Password:</label>
            <input 
              type="password" 
              id="password" 
              value={form.password} 
              onChange={handleChange} 
              placeholder="Password" 
              required 
              disabled={loading} // Disable during loading
            />
            <div className="password-requirements">
                Password must contain a lowercase, uppercase, number, and special character.
            </div>
            
            <label>Confirm Password:</label>
            <input 
              type="password" 
              id="confirmPassword" 
              value={form.confirmPassword} 
              onChange={handleChange} 
              placeholder="Confirm Password" 
              required 
              disabled={loading} // Disable during loading
            />
            
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