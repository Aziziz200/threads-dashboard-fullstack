import Jwt from '@hapi/jwt';
import dotenv from 'dotenv';

dotenv.config();

export const generateToken = (userId: string) => {
  return Jwt.token.generate(
    {
      aud: 'threads-app',
      iss: 'threads-backend',
      userId,
    },
    {
      key: process.env.JWT_SECRET!,
      algorithm: 'HS512',
    },
    {
      ttlSec: 7 * 24 * 60 * 60, // 7 days
    }
  );
};