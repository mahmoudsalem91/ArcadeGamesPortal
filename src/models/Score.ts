import mongoose, { Document } from 'mongoose';

// Score interface
export interface IScore extends Document {
  userId: mongoose.Schema.Types.ObjectId | null; // For registered users
  guestTag: string | null; // For guest users
  gameId: string;
  score: number;
  date: Date;
  duration: number; // Game duration in seconds
}

// Score schema
const ScoreSchema = new mongoose.Schema<IScore>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  guestTag: {
    type: String,
    default: null,
    minlength: [3, 'Guest tag must be at least 3 characters long'],
    maxlength: [20, 'Guest tag cannot exceed 20 characters']
  },
  gameId: {
    type: String,
    required: [true, 'Game ID is required'],
    trim: true
  },
  score: {
    type: Number,
    required: [true, 'Score is required']
  },
  date: {
    type: Date,
    default: Date.now
  },
  duration: {
    type: Number,
    default: 0
  }
});

// Add validation to ensure either userId or guestTag is provided
ScoreSchema.pre('save', function(next) {
  if (!this.userId && !this.guestTag) {
    return next(new Error('Either userId or guestTag must be provided'));
  }
  next();
});

// Create and export Score model
export default mongoose.model<IScore>('Score', ScoreSchema); 