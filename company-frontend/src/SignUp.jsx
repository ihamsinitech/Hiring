import React, { useState } from "react";
import "./SignUp.css";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signup = async () => {
    const data = {
      fullName: fullName.toUpperCase(),
      email,
      password,
    };

    try {
      const res = await fetch("http://localhost:8085/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const msg = await res.text();
      alert(msg);

      if (msg.includes("successful")) {
        navigate("/signin");
      }
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="signup-page">
      <div className="container">
        {/* Left Side Image */}
        <div className="image-section">
          <img src="animation.png" alt="Lady Illustration" className="lady-img" />
        </div>

        {/* Glassmorphism Sign Up Form */}
        <div className="glass-card">
          <h2>Sign Up</h2>

          <label>Full Name:</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full Name"
            style={{ textTransform: "uppercase" }}
            required
          />

          <label>Email Id:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />

          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />

          <small className="password-rule">
            Password must contain lowercase, uppercase, number, and special character
          </small>

          <button type="button" onClick={signup}>Sign Up</button>
          <p>
            Already have an account? <a href="/signin">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
}
