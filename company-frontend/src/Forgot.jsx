import React, { useState } from "react";
import "./Forgot.css"; // your glassmorphism CSS
import { useNavigate } from "react-router-dom";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confPass, setConfPass] = useState("");
  const navigate = useNavigate();

  const forgot = async () => {
    if (!email || !newPass || !confPass) {
      alert("All fields are required!");
      return;
    }

    if (newPass !== confPass) {
      alert("Passwords do not match!");
      return;
    }

    let data = {
      email: email,
      newPassword: newPass,
    };

    try {
      let res = await fetch("http://localhost:8085/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      let msg = await res.text();
      alert(msg);

      if (msg.toLowerCase().includes("success")) {
        navigate("/signin"); // redirect after success
      }
    } catch (error) {
      console.error("Forgot password failed:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="glass-card">
      <h2>Forgot Password</h2>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Enter new password"
        value={newPass}
        onChange={(e) => setNewPass(e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirm new password"
        value={confPass}
        onChange={(e) => setConfPass(e.target.value)}
      />

      <button onClick={forgot}>Save</button>

      <p>
        <a href="/signin">Back to Sign In</a>
      </p>
    </div>
  );
}
