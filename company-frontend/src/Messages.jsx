import React, { useEffect, useState } from "react";
import "./Messages.css";

const Messages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("userData"));
  if (storedUser) {
    fetch(`http://15.206.41.13:8085/api/auth/student/${storedUser.userId}/messages`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMessages(data);
        } else {
          setMessages([]);
          console.error("Messages API returned non-array:", data);
        }
      })
      .catch(err => console.error("Error:", err));
  }
}, []);


  return (
    <div className="messages-container">
      <h2>Messages</h2>
      {messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        <ul className="messages-list">
          {messages.map(msg => (
            <li key={msg.id} className="message-card">
              <p><strong>From:</strong> {msg.from}</p>
              <p>{msg.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Messages;
