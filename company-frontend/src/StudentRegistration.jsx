import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentRegistration.css';

const StudentRegistration = () => {
  const [form, setForm] = useState({
    education: '',
    yearOfPassing: '',
    place: '',
    status: 'Fresher',
    companyName: '',
    yearsOfExp: '',
    role: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get the user email from the logged-in user (you might want to use context or localStorage)
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userData.email) {
      setUserEmail(userData.email);
    } else {
      // If no user data, redirect to signin
      navigate('/signin');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm({
      ...form,
      [id]: value
    });
  };

  const register = async () => {
    setError('');
    setMessage('');
    
    try {
      const response = await fetch('http://localhost:8085/api/auth/complete-student-registration', {        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          ...form
        }),
      });
      
      const data = await response.text();
      
      if (response.ok) {
        setMessage('Registration completed successfully! Redirecting to home...');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError(data);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="student-container">
      <header className="student-header">
        <div className="student-logo">
          <a href="/">
            <img src="logo-website.png" alt="Company Logo" />
          </a>
          <h1>Complete Student Registration</h1>
        </div>
      </header>

      <div className="student-section">
      <div className="student-box">
        {/* Left Side Image */}
        <div className="student-image">
          <img src="annimation-8.png" alt="Illustration" />
        </div>

        {/* Right Side Form */}
        <div className="student-form">
          <h2>Complete Your Profile</h2>
          {error && <div className="error">{error}</div>}
          {message && <div className="success">{message}</div>}

          <label> Student Full Name</label>
          <input
            type="text"
            id="studentName"
            name="studentName"
            placeholder="Enter your full name"
            required
          />
           <label>Student Email Id:</label>
            <input
              type="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <div className="error-message">{errors.email}</div>}

          <label>Education</label>
          <input
            type="text"
            id="education"
            value={form.education}
            onChange={handleChange}
            placeholder="Education"
            required
          />

          <label>Passing Year</label>
          <select
            id="yearOfPassing"
            value={form.yearOfPassing}
            onChange={handleChange}
            required
          >
            <option value="">--Select Year--</option>
            <option>2025</option>
            <option>2024</option>
            <option>2023</option>
            <option>2022</option>
            <option>2021</option>
            <option>2020</option>
            <option>2019</option>
            <option>2018</option>
          </select>

          <label>Place</label>
          <select
            id="place"
            value={form.place}
            onChange={handleChange}
            required
          >
            <option value="">--Select Place--</option>
            <option>India</option>
            <option>USA</option>
            <option>UK</option>
            <option>Canada</option>
            <option>Australia</option>
            <option>Germany</option>
            <option>Singapore</option>
            <option>Dubai</option>
          </select>

          <label>Status</label>
          <select id="status" value={form.status} onChange={handleChange}>
            <option value="Fresher">Fresher</option>
            <option value="Experience">Experience</option>
          </select>

          {form.status === "Experience" && (
            <>
              <label>Company Name</label>
              <input
                type="text"
                id="companyName"
                value={form.companyName}
                onChange={handleChange}
                placeholder="Company Name"
              />

              <label>Years Of Experience</label>
              <input
                type="text"
                id="yearsOfExp"
                value={form.yearsOfExp}
                onChange={handleChange}
                placeholder="Years of Experience"
              />

              <label>Role</label>
              <input
                type="text"
                id="role"
                value={form.role}
                onChange={handleChange}
                placeholder="Role/Domain"
              />
            </>
          )}

          <button type="button" onClick={register}>
            Complete Registration
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default StudentRegistration;