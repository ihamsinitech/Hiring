import React, { useEffect, useState } from "react";
import "./StudentProfile.css";

const StudentProfile = () => {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    mobile: "",
    place: "",
    status: ""
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");

  const storedUser = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    if (storedUser) {
      fetch(`http://15.206.41.13:8085/api/auth/student/${storedUser.userId}/profile`)
        .then(res => res.json())
        .then(data => {
          setProfile(data);
          setLoading(false);
        })
        .catch(err => console.error("Error:", err));
    }
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    fetch(`http://15.206.41.13:8085/api/auth/student/${storedUser.userId}/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: profile.fullName,
        email: profile.email,
        mobile: profile.mobile
      })
    })
      .then(res => res.json())
      .then(data => {
        setMessage(data.message || "Profile updated successfully");
        setEditing(false);
      })
      .catch(err => console.error("Error updating profile:", err));
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    window.location.href = "/login";
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="student-profile-container">
      <div className="profile-card">
        <h2>Student Profile</h2>

        <label>Full Name:</label>
        <input
          type="text"
          name="fullName"
          value={profile.fullName}
          onChange={handleChange}
          disabled={!editing}
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          disabled={!editing}
        />

        <label>Mobile:</label>
        <input
          type="text"
          name="mobile"
          value={profile.mobile}
          onChange={handleChange}
          disabled={!editing}
        />

        <p><strong>Place:</strong> {profile.place}</p>
        <p><strong>Status:</strong> {profile.status}</p>

        {message && <p className="success-message">{message}</p>}

        {!editing ? (
          <button onClick={() => setEditing(true)}>Edit Profile</button>
        ) : (
          <button onClick={handleUpdate}>Save Changes</button>
        )}
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </div>
  );
};

export default StudentProfile;
