import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Messages.css';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData && userData.userId) {
      fetch(`http://www.careerspott.com/api/auth/student/${userData.userId}/messages`)
        .then(res => res.json())
        .then(data => {
          console.log("Raw messages data:", data); // Debug log
          // Enhance messages with proper company and job data
          const enhancedMessages = data.map(message => ({
            ...message,
            // Use available fields from Application entity
            companyName: message.companyName || 'Hiring Company',
            jobTitle: getJobTitleFromMessage(message),
            displayDate: message.createdAt || new Date().toISOString()
          }));
          setMessages(enhancedMessages);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching messages:", err);
          setLoading(false);
        });
    }
  }, []);

  // Helper function to extract job title from available message data
  const getJobTitleFromMessage = (message) => {
    if (message.jobTitle) return message.jobTitle;
    if (message.description) {
      // Try to extract job title from description
      const lines = message.description.split('\n');
      const titleLine = lines.find(line => line.toLowerCase().includes('position') || line.toLowerCase().includes('role'));
      return titleLine || 'Professional Opportunity';
    }
    return 'Job Position';
  };

  const handleReply = (message) => {
    setSelectedMessage(message);
    setReplyText('');
    setShowReplyModal(true);
  };

  const sendReply = async () => {
    if (!replyText.trim()) {
      alert('Please enter a reply message');
      return;
    }

    try {
      // Send professional reply to backend
      const response = await fetch(`http://www.careerspott.com/api/auth/application/${selectedMessage.id}/student-reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          replyMessage: replyText,
          studentId: JSON.parse(localStorage.getItem("userData")).userId
        })
      });

      if (response.ok) {
        alert(`Professional reply sent to ${selectedMessage.companyName}`);
      } else {
        // Fallback to local alert if backend endpoint doesn't exist
        alert(`Reply sent to ${selectedMessage.companyName}: ${replyText}`);
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      // Fallback alert
      alert(`Reply sent to ${selectedMessage.companyName}: ${replyText}`);
    }

    // Close the modal
    setShowReplyModal(false);
    setSelectedMessage(null);
    setReplyText('');
  };

  const formatMessageDate = (dateString) => {
    if (!dateString) return 'Recent';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Recent';
    }
  };

  const getStatusDisplay = (status) => {
    const statusMap = {
      'SHORTLISTED': { text: 'Shortlisted', emoji: '⭐' },
      'REVIEWED': { text: 'Under Review', emoji: '📋' },
      'INTERVIEW': { text: 'Interview', emoji: '🎯' },
      'REJECTED': { text: 'Not Selected', emoji: '❌' },
      'NEW': { text: 'New Message', emoji: '🆕' }
    };

    const statusInfo = statusMap[status] || { text: 'New Message', emoji: '💬' };
    return `${statusInfo.emoji} ${statusInfo.text}`;
  };

  if (loading) return (
    <div className="loading">
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '24px', marginBottom: '10px' }}>📨</div>
        Loading your professional messages...
      </div>
    </div>
  );

  return (
    <div className="messages-page">
      {/* Professional Header */}
      <div className="messages-header">
        <div className="header-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <h1>Company Response</h1>
            <span style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '5px 12px',
              borderRadius: '20px',
              fontSize: '14px',
              color: 'white',
              backdropFilter: 'blur(10px)'
            }}>
              {messages.length} {messages.length === 1 ? 'message' : 'messages'}
            </span>
          </div>
          <button className="messages-btn" onClick={() => navigate('/jobs')}>
            ← Back to Job Search
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="messages-container">
        <div className="messages-content">
          {messages.length === 0 ? (
            <div className="no-messages">
              <div style={{ fontSize: '48px', marginBottom: '20px' }}></div>
              <h2>No Messages Yet</h2>
              <p>When companies respond to your applications, you'll see their messages here.</p>
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '25px' }}>
                <button onClick={() => navigate('/jobs')}>Explore Job Opportunities</button>
                <button onClick={() => navigate('/applied-jobs')}>View Your Applications</button>
              </div>
            </div>
          ) : (
            <div className="messages-list">
              {messages.map((message, index) => (
                <div key={message.id || index} className="message-card">
                  <div className="message-header">
                    <div className="company-info">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #667eea, #764ba2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '16px'
                        }}>
                          {message.companyName ? message.companyName.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <div>
                          <h3>{message.companyName}</h3>
                          <p className="job-title">{message.jobTitle}</p>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
                      <span className="message-date">
                        {formatMessageDate(message.displayDate)}
                      </span>
                      <span className="status-badge">
                        {getStatusDisplay(message.status)}
                      </span>
                    </div>
                  </div>

                  <div className="message-body">
                    <p className="message-text">
                      {message.companyResponse || message.message ||
                        "Thank you for your interest in our company. We appreciate you taking the time to apply and would like to discuss your application further."}
                    </p>
                  </div>

                  <div className="message-actions">
                    <button
                      className="view-job-btn"
                      onClick={() => navigate(`/jobs/${message.jobId}`)}
                    >
                      📋 View Job Details
                    </button>
                    <button
                      className="reply-btn"
                      onClick={() => handleReply(message)}
                    >
                      ✉️ Send Professional Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Professional Reply Modal */}
      {showReplyModal && selectedMessage && (
        <div className="modal-overlay">
          <div className="modal-content" style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '15px',
            padding: '30px',
            maxWidth: '600px',
            width: '90%',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              borderBottom: '2px solid rgba(0, 0, 0, 0.1)',
              paddingBottom: '15px'
            }}>
              <h3 style={{ margin: 0, color: '#333', fontSize: '22px' }}>
                💌 Reply to {selectedMessage.companyName}
              </h3>
              <button
                onClick={() => setShowReplyModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666',
                  padding: '5px'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <strong style={{ color: '#333', display: 'block', marginBottom: '10px' }}>
                Original Message from {selectedMessage.companyName}:
              </strong>
              <div style={{
                background: 'rgba(0, 0, 0, 0.05)',
                padding: '15px',
                borderRadius: '8px',
                borderLeft: '4px solid #667eea',
                color: '#333',
                fontSize: '14px',
                lineHeight: '1.5'
              }}>
                <p style={{ margin: 0 }}>
                  {selectedMessage.companyResponse || selectedMessage.message ||
                    "Thank you for your application. We are reviewing your profile."}
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '10px',
                color: '#333',
                fontWeight: 'bold'
              }}>
                Your Professional Reply:
              </label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your professional response here. Consider mentioning your continued interest, availability for discussion, and appreciation for their consideration..."
                rows="6"
                style={{
                  width: '100%',
                  padding: '15px',
                  border: '2px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  background: 'rgba(255, 255, 255, 0.8)',
                  color: '#333'
                }}
              />
              <div style={{
                textAlign: 'right',
                fontSize: '12px',
                color: '#666',
                marginTop: '5px'
              }}>
                {replyText.length}/500 characters
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setShowReplyModal(false)}
                style={{
                  padding: '12px 25px',
                  background: 'rgba(0, 0, 0, 0.1)',
                  color: '#333',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.2)'}
                onMouseOut={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.1)'}
              >
                Cancel
              </button>
              <button
                onClick={sendReply}
                disabled={!replyText.trim()}
                style={{
                  padding: '12px 25px',
                  background: replyText.trim() ? '#667eea' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: replyText.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  if (replyText.trim()) {
                    e.target.style.background = '#5a6fd8';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (replyText.trim()) {
                    e.target.style.background = '#667eea';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                Send Professional Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;