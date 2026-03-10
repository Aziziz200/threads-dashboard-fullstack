import Hapi from '@hapi/hapi';
import { connectDB } from './config/database.js';
import { registerSocketServer } from './plugins/socket.js';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import dotenv from 'dotenv';

dotenv.config();

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3001,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['http://localhost:3000'], // Next.js dev server
        credentials: true,
      },
    },
  });

  // Connect to MongoDB
  await connectDB();

  // Register JWT auth strategy
  await server.register(require('@hapi/jwt'));
  server.auth.strategy('jwt', 'jwt', {
    keys: process.env.JWT_SECRET!,
    verify: { aud: false, iss: false, sub: false, maxAgeSec: 604800 }, // 7 days
    validate: (artifacts: any) => {
      return { isValid: true, credentials: { userId: artifacts.decoded.payload.userId } };
    },
  });
  server.auth.default('jwt');

  // Register routes
  server.route([...authRoutes, ...postRoutes]);

  // Start server
  await server.start();
  console.log('Server running on %s', server.info.uri);

  // Attach Socket.io
  registerSocketServer(server);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
