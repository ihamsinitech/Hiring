import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminForgotPassword.css';

const AdminForgotPassword = () => {
    const [form, setForm] = useState({
        email: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false); 
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); 

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.id]: e.target.value
        });
        setError('');
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
        setLoading(true);

        if (form.newPassword !== form.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://15.206.41.13:8085/api/admin/forgot-password', {
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
                    navigate('/adminlogin');
                }, 3000);
            } else {
                setError(data);
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-forgot-container">
            <div className="admin-forgot-form">
                <h2>Admin Password Reset</h2>
                
                {error && <div className="admin-error-message">⚠️ {error}</div>}
                {message && <div className="admin-success-message">✅ {message}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Enter Existing EmailId "
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label>New Password</label>
                        <div className="password-input-container">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                id="newPassword"
                                value={form.newPassword}
                                onChange={handleChange}
                                placeholder="Enter new password"
                                required
                                disabled={loading}
                            />
                            <button 
                                type="button"
                                className="password-toggle-icon"
                                onClick={toggleNewPasswordVisibility}
                            >
                                {showNewPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        <div className="password-requirements">
                            Password must contain lowercase, uppercase, number, and special character.
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>
                        <div className="password-input-container">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm new password"
                                required
                                disabled={loading}
                            />
                            <button 
                                type="button"
                                className="password-toggle-icon"
                                onClick={toggleConfirmPasswordVisibility}
                            >
                                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>


                    <button type="submit" disabled={loading} className="reset-btn">
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>

                <div className="admin-forgot-links">
                    <p>
                        Remember your password? <a href="/adminlogin">Back to Login</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminForgotPassword;