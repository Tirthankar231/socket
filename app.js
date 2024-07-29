import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const PORT = 3000;

httpServer.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'src')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// Handle client connection
io.on('connection', (socket) => {
  console.log('New client connected');

  // Handle joining a channel
  socket.on('joinChannel', (channel) => {
    socket.join(channel);
    console.log(`${socket.id} joined channel ${channel}`);
  });

  // Handle leaving a channel
  socket.on('leaveChannel', (channel) => {
    socket.leave(channel);
    console.log(`${socket.id} left channel ${channel}`);
  });

  // Handle incoming messages
  socket.on('message', (data) => {
    const { channel, msg } = data;
    socket.to(channel).emit('message', msg);
  });

  // Handle client disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});
