import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";   // <-- import Link

import "./SignIn.css";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const res = await axios.post("http://localhost:8085/signin", {
        email,
        password,
      });

      const page = res.data;

      if (page === "home") {
        navigate("/home");
      } else if (page === "student-register") {
        navigate("/student-registration");
      } else if (page === "company-register") {
        navigate("/company-registration");
      } else if (page === "posting") {
        navigate("/posting-form");
      } else {
        alert("Unexpected response: " + page);
      }
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="glass-card">
      <h2>Sign In</h2>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignIn}>Sign In</button>

      {/* Forgot Password Link */}
      <p>
        <Link to="/forgot">Forgot Password?</Link>
      </p>

      <p>
        Don’t have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}

export default SignIn;
