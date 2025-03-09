import { Request, Response } from 'express';
import Score from '../models/Score';

/**
 * Submit a new score
 * @route POST /api/scores
 * @access Public (but requires either logged-in user or guest tag)
 */
export const submitScore = async (req: Request, res: Response): Promise<void> => {
  try {
    const { gameId, score, duration, guestTag } = req.body;
    
    // Check if we have a logged-in user or a guest tag
    const userId = req.user ? req.user._id : null;
    
    if (!userId && !guestTag) {
      res.status(400).json({ message: 'Either user authentication or guest tag is required' });
      return;
    }

    // Create new score entry
    const newScore = await Score.create({
      userId,
      guestTag: userId ? null : guestTag, // Only use guestTag if not a logged-in user
      gameId,
      score,
      duration,
      date: new Date()
    });

    res.status(201).json({
      message: 'Score submitted successfully',
      score: newScore
    });
  } catch (error) {
    console.error('Score submission error:', error);
    res.status(500).json({ 
      message: 'Server error during score submission',
      error: (error as Error).message 
    });
  }
};

/**
 * Get top scores for a specific game
 * @route GET /api/scores/:gameId
 * @access Public
 */
export const getTopScores = async (req: Request, res: Response): Promise<void> => {
  try {
    const { gameId } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;
    
    // Get top scores for the specified game
    const topScores = await Score.find({ gameId })
      .sort({ score: -1 }) // Sort by score in descending order
      .limit(limit)
      .populate('userId', 'username') // Populate user info if available
      .lean(); // Convert to plain JavaScript objects

    // Format the response
    const formattedScores = topScores.map(score => ({
      score: score.score,
      date: score.date,
      player: score.userId ? (score.userId as any).username : score.guestTag,
      isGuest: !score.userId,
      duration: score.duration
    }));

    res.json(formattedScores);
  } catch (error) {
    console.error('Get top scores error:', error);
    res.status(500).json({ 
      message: 'Server error retrieving top scores',
      error: (error as Error).message 
    });
  }
};

/**
 * Get user's scores for all games
 * @route GET /api/scores/user
 * @access Private
 */
export const getUserScores = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    
    // Get all scores for the user
    const userScores = await Score.find({ userId })
      .sort({ date: -1 }) // Sort by date in descending order
      .lean();

    res.json(userScores);
  } catch (error) {
    console.error('Get user scores error:', error);
    res.status(500).json({ 
      message: 'Server error retrieving user scores',
      error: (error as Error).message 
    });
  }
};

/**
 * Get guest's scores by tag
 * @route GET /api/scores/guest/:guestTag
 * @access Public
 */
export const getGuestScores = async (req: Request, res: Response): Promise<void> => {
  try {
    const { guestTag } = req.params;
    
    // Get all scores for the guest tag
    const guestScores = await Score.find({ guestTag })
      .sort({ date: -1 }) // Sort by date in descending order
      .lean();

    res.json(guestScores);
  } catch (error) {
    console.error('Get guest scores error:', error);
    res.status(500).json({ 
      message: 'Server error retrieving guest scores',
      error: (error as Error).message 
    });
  }
}; 