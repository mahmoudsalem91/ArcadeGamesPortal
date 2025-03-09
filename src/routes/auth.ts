import express from 'express';
import { register, login, getProfile, validateGuest } from '../controllers/auth';
import { protect } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/guest', validateGuest);

// Protected routes
router.get('/profile', protect, getProfile);

export default router; 