import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Messages.css';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData && userData.userId) {
      fetch(`http://15.206.41.13:8085/api/auth/student/${userData.userId}/messages`)
        .then(res => res.json())
        .then(data => {
          setMessages(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching messages:", err);
          setLoading(false);
        });
    }
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="messages-page">
      {/* Full width header */}
      <div className="messages-header">
        <div className="header-content">
          <h1>Messages ({messages.length})</h1>
          <button className="back-btn" onClick={() => navigate('/jobs')}>Back to Jobs</button>
        </div>
      </div>

      {/* Centered content container */}
      <div className="messages-container">
        <div className="messages-content">
          {messages.length === 0 ? (
            <div className="no-messages">
              <h2>No messages yet</h2>
              <p>You'll receive messages here when companies respond to your applications</p>
              <button onClick={() => navigate('/jobs')}>Browse Jobs</button>
            </div>
          ) : (
            <div className="messages-list">
              {messages.map(message => (
                <div key={message.id} className="message-card">
                  <div className="message-header">
                    <div className="company-info">
                      <h3>{message.companyName}</h3>
                      <p className="job-title">{message.jobTitle}</p>
                    </div>
                    <span className="message-date">{new Date(message.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="message-body">
                    <p className="message-text">{message.message || "We are interested in your profile and would like to schedule an interview."}</p>
                    <div className="message-status">
                      <span className="status-badge">{message.status || "New Message"}</span>
                    </div>
                  </div>
                  <div className="message-actions">
                    <button className="view-job-btn" onClick={() => navigate(`/jobs/${message.jobId}`)}>
                      View Job
                    </button>
                    <button className="reply-btn">
                      Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;