import express from 'express';
import { submitScore, getTopScores, getUserScores, getGuestScores } from '../controllers/scores';
import { protect, guestCheck } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/:gameId', getTopScores);
router.get('/guest/:guestTag', getGuestScores);

// Routes that can be used by both authenticated users and guests
router.post('/', submitScore);

// Protected routes (authenticated users only)
router.get('/user/history', protect, getUserScores);

export default router; 