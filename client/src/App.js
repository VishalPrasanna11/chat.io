import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Chat from './Chat';

const socket = io('http://localhost:3000');

function App() {

  const [chats,setChats]=useState([]);
  const [chatText,setChatText]=useState('');

  useEffect(() => {
    socket.on('chat', (chat) => {
      setChats([...chats, chat]);
    });
  }, [chats]);

  const sendChat = () => {
    socket.emit('sendChat', { text: chatText });
    setChatText('');
  };

  return (
<div className="App">
      <h1>Chat.io</h1>
      {/* Chat interface components */}
      <div className="Chats">
        {chats.map((chat, index) => (
          <Chat key={index} username={chat.username} text={chat.text} />
        ))}
      </div>
      <div className="input-box">
        <input
          type="text"
          value={chatText}
          onChange={(e) => setChatText(e.target.value)}
          placeholder="Type your Chat..."
        />
        <button onClick={sendChat}>Send</button>
      </div>
    </div>
  );
}

export default App;
