import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./WelcomePage.css";

const WelcomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { companyName } = location.state || { companyName: "Guest Company" };

  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <img 
          src="/logo-website.png"   // <-- put your logo inside public/logo.png
          alt="Hamsini Tech Solutions Logo"
          className="logo"
        />
        <h1>Welcome {companyName}!</h1>
        <p>You are now a part of <b>Hamsini Tech Solutions</b>.</p>
        <button onClick={() => navigate("/jobs")}>View Jobs</button>
      </div>
    </div>
  );
};

export default WelcomePage;
