import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const [showSignupChoice, setShowSignupChoice] = useState(false);
  const navigate = useNavigate();

  const handleStudentSignup = () => {
    navigate("/signup");
  };

  const handleCompanySignup = () => {
    navigate("/companyRegistration");
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="glass-header">
        {/* Left: Logo */}
        <div className="logo-section">
          <a
            href="https://hamsinitechsolutions.com"
            target="_blank"
            rel="noreferrer"
          >
            <img src="/logo.png" alt="Company Logo" />
          </a>
        </div>

        {/* Right: Buttons */}
        <div className="btns">
          <button className="glass-btn" onClick={() => navigate("/signIn")}>
            Sign In
          </button>
          <button
            className="glass-btn"
            onClick={() => setShowSignupChoice(true)}
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero glass-container">
        <div className="hero-text">
          <h2>Best opportunity to build your career ✨</h2>
          <p>
            Join us to explore exciting career opportunities with the latest
            technologies.
          </p>
        </div>
        <div className="hero-img">
          <img src="/download.jpeg" alt="Career" />
        </div>
      </section>

      {/* SignUp Choice Modal */}
      {showSignupChoice && (
        <div className="modal-overlay">
          <div className="modal glass-container">
            {/* Close Icon */}
            <span
              className="close-icon"
              onClick={() => setShowSignupChoice(false)}
            >
              ✖
            </span>

            <h3>Choose Sign Up Type</h3>
            <div className="modal-buttons">
              <button className="glass-btn full-width" onClick={handleStudentSignup}>
                Student
              </button>
              <p> Or</p>
              <button className="glass-btn full-width" onClick={handleCompanySignup}>
                Company
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}