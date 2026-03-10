import { ServerRoute } from '@hapi/hapi';
import Boom from '@hapi/boom';
import { User } from '../models/User.js';
import { generateToken } from '../utils/auth.js';
import { registerSchema, loginSchema } from '../utils/validation.js';

const routes: ServerRoute[] = [
  {
    method: 'POST',
    path: '/api/auth/register',
    options: {
      auth: false,
      validate: {
        payload: registerSchema,
      },
    },
    handler: async (request, h) => {
      try {
        const { username, email, password } = request.payload as any;
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
          return Boom.conflict('User already exists');
        }
        const user = new User({ username, email, password });
        await user.save();
        const token = generateToken(user.id);
        return h.response({ token, user: { id: user.id, username, email } }).code(201);
      } catch (err) {
        console.error(err);
        return Boom.internal();
      }
    },
  },
  {
    method: 'POST',
    path: '/api/auth/login',
    options: {
      auth: false,
      validate: {
        payload: loginSchema,
      },
    },
    handler: async (request, h) => {
      try {
        const { email, password } = request.payload as any;
        const user = await User.findOne({ email });
        if (!user) {
          return Boom.unauthorized('Invalid email or password');
        }
        const isValid = await user.comparePassword(password);
        if (!isValid) {
          return Boom.unauthorized('Invalid email or password');
        }
        const token = generateToken(user.id);
        return { token, user: { id: user.id, username: user.username, email } };
      } catch (err) {
        console.error(err);
        return Boom.internal();
      }
    },
  },
];

export default routes;