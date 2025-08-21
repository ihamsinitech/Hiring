import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CompanyRegistration.css";

export default function CompanyRegistration() {
  const [formData, setFormData] = useState({
    companyName: "",
    companyEmail: "",
    password: "",
    mobile: "",
    address: "",
    payment: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8085/api/company/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("✅ Registration Successful");
      navigate("/signIn");
    } else {
      alert("❌ Registration Failed");
    }
  };

  return (
    <div className="form-page">
      <div className="glass-container">
        <div className="glass-card">
          <h2>Company Registration</h2>
          <form onSubmit={handleSubmit}>
            <label>Company Name:</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
            />

            <label>Company Email:</label>
            <input
              type="email"
              name="companyEmail"
              value={formData.companyEmail}
              onChange={handleChange}
              required
            />

            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <label>Mobile Number:</label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
            />

            <label>Address:</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />

            <label>Payment:</label>
            <input
              type="text"
              name="payment"
              value={formData.payment}
              onChange={handleChange}
              required
            />

            <button type="submit" className="glass-btn">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
