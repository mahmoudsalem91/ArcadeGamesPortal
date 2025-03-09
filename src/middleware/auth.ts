import { Request, Response, NextFunction } from 'express';
import { extractToken, verifyToken } from '../utils/jwt';
import User from '../models/User';

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * Middleware to authenticate JWT token and attach user to request object
 */
export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get token from authorization header
    const token = extractToken(req.headers.authorization);

    if (!token) {
      res.status(401).json({ message: 'Not authorized, no token provided' });
      return;
    }

    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      res.status(401).json({ message: 'Not authorized, token failed' });
      return;
    }

    // Get user from database
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

/**
 * Middleware to check if a guest tag is provided
 */
export const guestCheck = (req: Request, res: Response, next: NextFunction): void => {
  const { guestTag } = req.body;

  if (!guestTag || guestTag.length < 3) {
    res.status(400).json({ message: 'Guest tag must be at least 3 characters long' });
    return;
  }

  next();
}; 