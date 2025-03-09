# Arcade Games Portal - Project Context

## Project Overview
This is an arcade gaming portal that allows users to play various retro-style games through a web browser. The portal includes multiple games like Snake, Pong, Brick Breaker, Flappy Bird, and more, with a centralized user system and score tracking.

## User Authentication System

### Authentication Options
- **Sign Up / Login**: Users can create accounts to track their scores across all games
- **Guest Mode**: Users can play as guests with a temporary nametag (minimum 3 characters)

### User Data Requirements
- Username
- Password (stored encrypted)
- Email
- Profile information (optional)
- Game scores history

### Authentication Flow
1. When a user visits wplabs.se, they will be presented with options:
   - Continue as guest
   - Sign up for an account
   - Login to existing account
2. Guest users:
   - Must enter a temporary nametag (minimum 3 characters)
   - Will have scores tracked during their session
   - Scores will appear on leaderboards (even if not in top 10)
   - Data is not permanently stored in user profiles
3. Registered users:
   - Don't need to enter their name for each game session
   - Have persistent score tracking across the entire website
   - Can view their personal statistics and history

## Technical Requirements

### Cross-Device Compatibility
- All games must be fully playable across all devices and screen sizes:
  - Desktop computers and laptops
  - Tablets (both portrait and landscape)
  - Mobile phones (both portrait and landscape)
- Touch controls must be implemented for mobile/tablet users
- Keyboard controls for desktop users
- Automatic detection and adjustment of control schemes
- Responsive canvas sizing to maintain game proportions
- Dynamic UI elements that adapt to screen size

### Database
- **MongoDB** for user data storage
- Data to be encrypted for security
- Collections for:
  - Users
  - Scores
  - Game statistics

### Authentication System
- JWT (JSON Web Tokens) for session management
- Bcrypt for password hashing
- Form validation on both client and server sides

### Frontend
- TypeScript for all game implementations and UI logic
- Build process using npm run build to generate static files
- Responsive design for various screen sizes
- Consistent arcade-style UI/UX across games
- Static files served via Apache on Linux server

### Backend
- Apache server configuration for static file serving
- REST API for user authentication and score management
- Secure endpoints for user data operations

## Game Integration with User System

### For Guest Users
- Request nametag entry before game starts or when submitting a score
- Associate scores with the guest nametag
- Display nametag on leaderboards

### For Registered Users
- Automatically associate scores with user account
- Track performance across multiple game sessions
- Provide history and statistics

## Project Structure

### Directory Structure
```
/var/www/wplabs/
├── docs/                      # Documentation
│   ├── project_context.md     # Project context and requirements
│   └── project_plan.md        # Project plan and progress tracking
├── src/                       # TypeScript source code
│   ├── config/                # Configuration files
│   │   └── db.ts              # Database connection module
│   ├── controllers/           # Route controllers
│   │   ├── auth.ts            # Authentication controller
│   │   └── scores.ts          # Score management controller
│   ├── middleware/            # Express middleware
│   │   └── auth.ts            # Authentication middleware
│   ├── models/                # MongoDB models
│   │   ├── User.ts            # User model
│   │   └── Score.ts           # Score model
│   ├── routes/                # Express routes
│   │   ├── auth.ts            # Authentication routes
│   │   └── scores.ts          # Score management routes
│   ├── utils/                 # Utility functions
│   │   └── jwt.ts             # JWT token helpers
│   └── index.ts               # Application entry point
├── public/                    # Static files served directly by Apache
│   ├── css/                   # CSS stylesheets
│   │   └── auth.css           # Authentication styles
│   ├── js/                    # JavaScript files
│   │   ├── auth.js            # Authentication module
│   │   └── header.js          # Header component
│   ├── img/                   # Image assets
│   └── index.html             # Main HTML file
├── dist/                      # Compiled TypeScript (built from src)
├── node_modules/              # Node.js dependencies
├── .env                       # Environment variables
├── package.json               # Project metadata and dependencies
├── tsconfig.json              # TypeScript configuration
├── start.sh                   # Startup script
└── apache_config.conf         # Apache server configuration
```

### Database Schema

#### User Schema
```typescript
{
  _id: ObjectId,               // MongoDB ID
  username: {                  // Username for login and display
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 20
  },
  email: {                     // Email for login and contact
    type: String,
    required: true,
    unique: true
  },
  password: {                  // Bcrypt hashed password
    type: String,
    required: true,
    minlength: 6
  },
  createdAt: {                 // Account creation date
    type: Date,
    default: Date.now
  },
  lastLogin: {                 // Last login timestamp
    type: Date,
    default: Date.now
  }
}
```

#### Score Schema
```typescript
{
  _id: ObjectId,               // MongoDB ID
  userId: {                    // Reference to User (if registered)
    type: ObjectId,
    ref: 'User',
    default: null
  },
  guestTag: {                  // Guest tag (if not registered)
    type: String,
    default: null,
    minlength: 3,
    maxlength: 20
  },
  gameId: {                    // Game identifier
    type: String,
    required: true
  },
  score: {                     // Player's score
    type: Number,
    required: true
  },
  date: {                      // When the score was achieved
    type: Date,
    default: Date.now
  },
  duration: {                  // Game duration in seconds
    type: Number,
    default: 0
  }
}
```

## Technical Implementation Notes

### Security Considerations
- All passwords must be hashed and salted
- User sessions must be properly managed with secure tokens
- Input validation to prevent injection attacks
- Rate limiting for authentication attempts
- Proper Apache security configurations

### Performance Goals
- Games should load quickly
- Smooth gameplay experience
- Responsive design for mobile playability
- Consistent frame rates across all devices
- Optimized assets for different screen resolutions
- Efficient TypeScript compilation and bundling

### Development Approach
- TypeScript-first development approach
- Build process to generate optimized static files
- Use MongoDB for data persistence
- Implement proper separation of concerns between game logic and user management
- Device-agnostic code implementation
- Progressive enhancement for better device support

## Future Considerations
- Social features (friends, challenges)
- Additional games
- Achievement systems
- Customizable profiles
- Mobile-specific optimizations
- Device-specific control schemes
- Offline gameplay capabilities
- Advanced TypeScript features implementation