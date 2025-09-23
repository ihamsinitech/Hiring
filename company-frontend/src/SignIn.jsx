import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SignIn.css';

const SignIn = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch('http://15.206.41.13:8085/api/auth/signin', {
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
        // Store user data
        localStorage.setItem('userData', JSON.stringify({
          email: form.email,
          userId,
          userType,
          completed
        }));
        if (!completed) {
          navigate(redirect); // e.g., /student-registration
        } else {
          navigate(redirect); // e.g., /jobs or /posting-form
        }

      } else {
        setError(data.message || "Incorrect email or password");
      }

    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
        
        

  return (
    <div className="auth-container">
      <header className="signin-header">
        <div className="signin-logo">
          <a href="/">
            <img src="logo-website.png" alt="Company Logo" />
          </a>
          <h1>Sign In</h1>
        </div>
      </header>

      <section className="signin-section">
      <div className="signin-wrapper">
      
        <div className="signin-form">
          <h2>Sign In</h2>
          {error && <div className="error-message">{error}</div>}
          
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
            
            <label>Password:</label>
            <input 
              type="password" 
              id="password" 
              value={form.password} 
              onChange={handleChange} 
              placeholder="Password" 
              required 
            />
            
            <div className="auth-links">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
            
            <button type="submit">Sign In</button>
          </form>
          
          <div className="auth-redirect">
            <p>Don't have an account? <Link to="/signUp">Sign Up</Link></p>
          </div>
        </div>
        {/* Right Side: Image */}
        <div className="signin-image">
          <img src="animation-3.png" alt="Sign In Illustration" />
        </div>
        </div>
      </section>
    </div>
  );
};

export default SignIn;