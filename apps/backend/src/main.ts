import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app, { corsOptions } from './app';
import { getAllActions, getQueue } from './controllers/actionController';
import { isTestEnv } from './utils/utils';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;


const httpServer = createServer(app);

export const io = new SocketIOServer(httpServer, {
  cors: corsOptions,
});

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

// Check if the server is running in test mode to handle the error "Uncaught Error: listen EADDRINUSE: address already in use"
if (!isTestEnv() || require.main === module) {
  httpServer.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`);
  });
}
