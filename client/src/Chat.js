
// Chat.jsx - Individual chat message component
import React from 'react';

const Chat = ({ username, text, isCurrentUser }) => {
  return (
    <div className={`chat-message ${isCurrentUser ? 'current-user' : ''}`}>
      <div className="message-bubble">
        <p className="chat-username">{username}</p>
        <p className="chat-text">{text}</p>
      </div>
    </div>
  );
};

export default Chat;