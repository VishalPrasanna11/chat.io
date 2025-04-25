import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Chat from './Chat';

const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_SERVER_URL || 'http://localhost:8000';
const socket = io(SOCKET_SERVER_URL);

function App() {
  const [chats, setChats] = useState([]);
  const [chatText, setChatText] = useState('');
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [whoIsTyping, setWhoIsTyping] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Chat message listener
    socket.on('chat', (chat) => {
      setChats(prevChats => [...prevChats, chat]);
    });

    // Typing status listeners
    socket.on('userTyping', (typingUser) => {
      setWhoIsTyping(prev => 
        prev.includes(typingUser) ? prev : [...prev, typingUser]
      );
    });

    socket.on('userStoppedTyping', (typingUser) => {
      setWhoIsTyping(prev => 
        prev.filter(user => user !== typingUser)
      );
    });

    // Clean up on component unmount
    return () => {
      socket.off('chat');
      socket.off('userTyping');
      socket.off('userStoppedTyping');
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendChat = (e) => {
    e.preventDefault();
    if (chatText.trim()) {
      socket.emit('sendChat', { 
        text: chatText,
        username: username
      });
      setChatText('');
      socket.emit('stopTyping', username);
      setIsTyping(false);
    }
  };

  const handleInputChange = (e) => {
    setChatText(e.target.value);
    
    // Handle typing indicators
    if (!isTyping && e.target.value.trim()) {
      setIsTyping(true);
      socket.emit('typing', username);
    } else if (isTyping && !e.target.value.trim()) {
      setIsTyping(false);
      socket.emit('stopTyping', username);
    }
  };

  const setUserAndJoin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      socket.emit('userJoined', username);
      setIsUsernameSet(true);
    }
  };

  return (
    <div className="app-container">
      {!isUsernameSet ? (
        <div className="username-modal">
          <div className="username-content">
            <h2>Welcome to Chat.io</h2>
            <form onSubmit={setUserAndJoin}>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username..."
                className="username-input"
              />
              <button type="submit" className="join-button">Join Chat</button>
            </form>
          </div>
        </div>
      ) : (
        <>
          <header className="chat-header">
            <h1>Chat.io</h1>
            <p className="user-welcome">Welcome, {username}!</p>
          </header>
          
          <div className="chat-container">
            <div className="messages-container">
              {chats.map((chat, index) => (
                <Chat 
                  key={index} 
                  username={chat.username} 
                  text={chat.text} 
                  isCurrentUser={chat.username === username}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {whoIsTyping.length > 0 && (
              <div className="typing-indicator">
                {whoIsTyping.length === 1 
                  ? `${whoIsTyping[0]} is typing...` 
                  : `${whoIsTyping.join(', ')} are typing...`}
              </div>
            )}
          </div>
          
          <div className="input-container">
            <form onSubmit={sendChat}>
              <input
                type="text"
                value={chatText}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="message-input"
              />
              <button type="submit" className="send-button">Send</button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default App;