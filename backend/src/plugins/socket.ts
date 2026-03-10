import { Server as HttpServer } from '@hapi/hapi';
import { Server as SocketServer } from 'socket.io';
import { verify } from '@hapi/jwt'; // we need to verify token for socket connections

let io: SocketServer;

export const registerSocketServer = (server: HttpServer) => {
  io = new SocketServer(server.listener, {
    cors: { origin: 'http://localhost:3000', credentials: true },
  });

  // Middleware to authenticate socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));
    try {
      const decoded = verify.token(token, process.env.JWT_SECRET!);
      socket.data.userId = decoded.payload.userId;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.data.userId);
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.data.userId);
    });
  });
};

export { io };