import React from "react";
import { Link } from "react-router-dom";
import "./SuccessPage.css";

const SuccessPage = () => {
  return (
    <div className="success-page">
      <div className="success-container">
        {/* ✅ Success Icon */}
        <div className="success-icon">
          <span>✔</span>
        </div>

        <h2>Application Submitted Successfully!</h2>
        <p>Thank you for applying. Our team will contact you soon.</p>

        <Link to="/" className="home-btn">Go to Home</Link>
      </div>
    </div>
  );
};

export default SuccessPage;
