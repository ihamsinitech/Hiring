import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SuccessPage.css";



const StudentSuccessPage = () => {
  const navigate = useNavigate();


  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/signin");
    }, 5000); // 5000ms = 5 seconds

    return () => clearTimeout(timer); // cleanup
  }, [navigate]);

  return (
    <div className="success-page">
      <div className="success-container">
        {/* ✅ Success Icon */}
        <div className="success-icon">
          <span>👍</span>
        </div>

        <h2>Registration Submitted Successfully!</h2>
        <p>Thank you for registering. Our team will support your carrer .</p>


        <Link to="/signin" className="home-btn">Go to Home</Link>

      </div>
    </div>
  );
};

export default StudentSuccessPage;