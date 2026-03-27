const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

io.on('connection', (socket) => {
    console.log('User connected: ' + socket.id);

    // Join a specific game room
    socket.on('join-room', (roomCode) => {
        socket.join(roomCode);
        console.log('User joined room: ' + roomCode);
    });

    // Sync clicked number with other player
    socket.on('click-number', (data) => {
        // data contains { room: '123', number: 5 }
        io.to(data.room).emit('number-clicked', data.number);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log('Bingo Server is running on port ' + PORT);
});

