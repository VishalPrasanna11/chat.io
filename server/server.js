// Import all the three modules 
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

//Add Cors for cross-orgin resource access
const cors= require('cors')
// Create an express Application which will handle all the Http request and enable real time communctions using socket.Io

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
      origin: '*',
    }
});

const PORT = process.env.PORT || 8000;

// Starting the server

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle the socket.io connection
io.on('connection', (socket) => {
    console.log('New user connected');
    socket.on('sendChat', (message) => {
        io.emit('chat', message); // Broadcast the message to all connected clients
    });
  
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

