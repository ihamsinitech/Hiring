import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./WelcomePage.css";

const WelcomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { companyName } = location.state || { companyName: "Guest Company" };

  // ✅ Auto redirect after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/companyDashboard");
    }, 5000); // 5000ms = 5 seconds

    return () => clearTimeout(timer); // cleanup on unmount
  }, [navigate]);

  return (
    <div className="welcome-container">
      <header className="welcome-header">
        <div className="welcome-logo">
          <a href="/">
            <img src="logo-website.png" alt="Company Logo" />
          </a>
          <h1>Career Spott</h1>
        </div>
      </header>

      <div className="welcome-card">
        <img
          src="/logo-website.png" // keep this inside public/
          alt="Hamsini Tech Solutions Logo"
          className="logo"
        />
        <h1>Welcome {companyName}!</h1>
        <p>You are now a part of <b>Hamsini Tech Solutions</b>.</p>
        <button onClick={() => navigate("/companyDashboard")}>View Jobs</button>
        
      </div>
    </div>
  );
};

export default WelcomePage;
