# Arcade Games Portal

A modern web-based arcade gaming portal with user authentication and score tracking across multiple games.

## Project Status

| Component | Status | Progress |
|-----------|--------|----------|
| User Authentication System | In Progress | 80% |
| MongoDB Integration | Completed | 100% |
| Login/Signup Interface | Completed | 100% |
| Guest Mode Implementation | Completed | 100% |
| Game-Auth Integration | In Progress | 75% |
| TypeScript Migration | In Progress | 50% |
| Cross-Device Testing | In Progress | 30% |
| Security Implementation | Completed | 100% |
| API Development | In Progress | 70% |
| Server Configuration | Completed | 100% |
| User Profile | In Progress | 80% |
| GitHub Integration | Completed | 100% |
| Leaderboard System | Completed | 100% |
| Caching System | Completed | 100% |

**Current Focus:** Gameplay Experience & Advanced Features

## Recent Improvements

- **Enhanced Leaderboard System**: Fixed layout issues and implemented dynamic score tracking
- **Improved User Authentication**: Better localStorage handling and JSON data parsing
- **Cache-Busting Implementation**: Added PHP timestamp-based cache busting for all resources
- **Cross-Device Compatibility**: Initial responsive design testing for mobile and tablet devices
- **Snake Game Integration**: Complete score tracking and integration with leaderboard system

## Known Issues

- **Browser Compatibility**: Some older browsers may not display advanced CSS styling properly
- **Mobile Touch Controls**: Need improvements for smaller screen devices
- **Real-time Updates**: Leaderboards currently require page refresh to show new scores from other players
- **Offline Support**: No offline gameplay capability yet

## Features

- **User Authentication**: Login, register, or play as a guest
- **Cross-Device Compatibility**: Responsive design that works on desktop, tablet, and mobile
- **Score Tracking**: Persistent score tracking for registered users
- **Guest Mode**: Play without an account using a guest tag
- **Game Framework**: Unified framework for game development and authentication integration
- **User Profiles**: View personal statistics and game history
- **Dynamic Leaderboards**: See your scores highlighted in the global leaderboard

## Included Games

- Snake: Navigate a snake to eat food and grow, without hitting walls or itself
- Pong: Classic table tennis game against an AI opponent
- Brick Breaker: Break all the bricks by bouncing a ball with a paddle
- Flappy Bird: Navigate through pipes by controlling a bird's flight
- Whack-a-Mole: Test your reflexes by whacking moles as they appear
- Memory Cards: Find matching pairs of cards in the fewest moves

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens), bcrypt
- **Server**: Apache for static files, Node.js for API
- **Storage**: localStorage for offline score tracking

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB
- Apache server

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/mahmoudsalem91/ArcadeGamesPortal.git
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with these variables:
   ```
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/arcade-games
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

4. Build the TypeScript code:
   ```
   npm run build
   ```

5. Start the server:
   ```
   npm start
   ```

## Development

- `npm run dev`: Start the development server with auto-restart
- `npm run build`: Build the TypeScript code
- `npm start`: Start the production server

## Project Structure

```
/
├── docs/                      # Documentation
│   ├── CHANGELOG.md           # Detailed change history
│   ├── project_context.md     # Project context and requirements
│   └── project_plan.md        # Project plan and progress
├── src/                       # TypeScript source code
│   ├── config/                # Configuration files
│   ├── controllers/           # Route controllers
│   ├── middleware/            # Express middleware
│   ├── models/                # MongoDB models
│   ├── routes/                # Express routes
│   ├── utils/                 # Utility functions
│   └── index.ts               # Application entry point
├── public/                    # Static files served by Apache
│   ├── css/                   # CSS stylesheets
│   ├── js/                    # JavaScript files
│   ├── games/                 # Game implementations
│   └── index.html             # Main HTML file
├── dist/                      # Compiled TypeScript output
└── README.md                  # This file
```

## License

This project is licensed under the MIT License 