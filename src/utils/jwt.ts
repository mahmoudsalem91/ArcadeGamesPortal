import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { IUser } from '../models/User';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_not_for_production';

// Token expiration (in seconds)
const TOKEN_EXPIRATION = 86400; // 24 hours

// Interface for token payload
interface TokenPayload {
  id: string;
  username: string;
}

/**
 * Generate a JWT token for a user
 * @param user User document
 * @returns JWT token
 */
export const generateToken = (user: IUser): string => {
  const payload: TokenPayload = {
    id: (user._id as mongoose.Types.ObjectId).toString(),
    username: user.username
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRATION
  });
};

/**
 * Verify and decode a JWT token
 * @param token JWT token
 * @returns Decoded token payload or null if invalid
 */
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
};

/**
 * Extract token from authorization header
 * @param authHeader Authorization header
 * @returns Token or null if not found
 */
export const extractToken = (authHeader: string | undefined): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.split(' ')[1];
}; 