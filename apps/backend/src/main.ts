import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

import { getAllActions, getQueue } from './controllers/actionController';
import actionRoutes from './routes/actionRoutes';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const corsOptions = {
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST'],
};

const app = express();
const httpServer = createServer(app);
export const io = new SocketIOServer(httpServer, {
  cors: corsOptions,
});

// API configuration
app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', actionRoutes);

// Socket configuration
io.on('connection', (socket) => {
  console.log('Client connected :', socket.id);

  socket.on('getAllActions', () => {
    getAllActions();
  });

  socket.on('getQueue', () => {
    getQueue();
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

httpServer.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});
