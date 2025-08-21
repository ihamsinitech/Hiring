import React, { useState } from "react";
import "./Registration.css";  // make sure the filename matches exactly
import { useNavigate } from "react-router-dom";

export default function Registration() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    education: "",
    yearOfPassing: "",
    place: "",
    status: "Fresher",
    companyName: "",
    yearsOfExp: "",
    role: "",
  });

  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm({ ...form, [id]: value });
  };

  const register = async () => {
    let data = {
      fullName: form.fullName.toUpperCase(),
      email: form.email,
      education: form.education,
      yearOfPassing: form.yearOfPassing,
      place: form.place,
      status: form.status,
      companyName: form.companyName,
      yearsOfExp: form.yearsOfExp,
      role: form.role,
    };

    try {
      let res = await fetch("http://localhost:8085/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      let msg = await res.text();
      alert(msg);

      if (msg.includes("completed")) {
        navigate("/"); // send user home
      }
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      {/* Glass Header */}
      <header className="glass-header">
        <div className="logo-section">
          <a href="/">
            <img src="logo.png" alt="Company Logo" />
          </a>
          <h1>Registration</h1>
        </div>
      </header>

      {/* Glass Container */}
      <section className="glass-container">
        <div className="glass-card">
          <h2>Registration Form</h2>

          <label>Full Name:</label>
          <input
            type="text"
            id="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            style={{ textTransform: "uppercase" }}
            required
          />

          <label>Email Id:</label>
          <input
            type="email"
            id="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />

          <label>Education:</label>
          <input
            type="text"
            id="education"
            value={form.education}
            onChange={handleChange}
            placeholder="Education"
            required
          />

          <label htmlFor="year">Passing Year:</label>
          <select id="yearOfPassing" value={form.yearOfPassing} onChange={handleChange} required>
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

          <label htmlFor="place">Place:</label>
          <select id="place" value={form.place} onChange={handleChange} required>
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

          <label htmlFor="status">Status:</label>
          <select id="status" value={form.status} onChange={handleChange}>
            <option value="Fresher">Fresher</option>
            <option value="Experience">Experience</option>
          </select>

          {/* Conditionally show experience fields */}
          {form.status === "Experience" && (
            <div id="expFields">
              <label>Company Name:</label>
              <input
                type="text"
                id="companyName"
                value={form.companyName}
                onChange={handleChange}
                placeholder="Company Name"
              />

              <label>Years Of Experience:</label>
              <input
                type="text"
                id="yearsOfExp"
                value={form.yearsOfExp}
                onChange={handleChange}
                placeholder="Years of Experience"
              />

              <label>Role:</label>
              <input
                type="text"
                id="role"
                value={form.role}
                onChange={handleChange}
                placeholder="Role/Domain"
              />
            </div>
          )}

          <button type="button" onClick={register}>
            Register
          </button>
        </div>
      </section>
    </>
  );
}
