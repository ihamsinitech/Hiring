import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminLogin.css';

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

     const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('https://www.careerspott.com/api/admin/login', formData);
            
            if (response.data.message === "Admin login successful") {
                localStorage.setItem('adminToken', 'admin-authenticated');
                localStorage.setItem('adminEmail', response.data.email);
                localStorage.setItem('adminId', response.data.adminId);
                navigate('/admindashboard');
            }
        } catch (error) {
            setError(error.response?.data || 'Login failed. Please check your credentials and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="login-form">
                <h2>Admin Login</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>📧 Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter admin email address"
                            disabled={loading}
                        />
                    </div>
                    
                    <div className="form-group">
                     <label>🔑 Password</label>
                    <div className="password-input-wrapper">
                    <input
                       type={showPassword ? "text" : "password"}
                       name="password"
                       value={formData.password}
                       onChange={handleChange}
                       required
                       placeholder="Enter your password"
                       disabled={loading}
                     />
                     <button 
                        type="button"
                        className={`password-toggle-icon ${showPassword ? 'visible' : 'hidden'}`}
                        onClick={togglePasswordVisibility}
                        tabIndex="-1"
                      >
                      {showPassword ? <i className="fa-solid fa-eye"></i> : <i className="fa-solid fa-eye-slash"></i> }
                    </button>
                  </div>
                </div>

                    {error && (
                        <div className="error-message">
                            ⚠️ {error}
                        </div>
                    )}

                    <div className="admin-links">
                        <Link to="/admin-forgot-password">Forgot Password?</Link>
                    </div>

                    
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="login-btn"
                    >
                        {loading ? '🔄 Logging in...' : ' Login to Dashboard'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;