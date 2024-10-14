import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import userRoutes from './routes/userRoutes';
import roomRoutes from './routes/roomRoutes';

dotenv.config();

const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);

app.get('/', (req, res) => {
  res.send('Multilanguage Chat API');
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room ${roomId}`);
  });

  socket.on('leave_room', (roomId) => {
    socket.leave(roomId);
    console.log(`User left room ${roomId}`);
  });

  socket.on('send_message', (data) => {
    console.log('Received message:', data);
    io.to(data.roomId).emit('receive_message', data);
    console.log('Emitted message to room:', data.roomId);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
