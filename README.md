# Arcade Games Portal

A modern web-based arcade gaming portal with user authentication and score tracking across multiple games.

## Features

- **User Authentication**: Login, register, or play as a guest
- **Cross-Device Compatibility**: Responsive design that works on desktop, tablet, and mobile
- **Score Tracking**: Persistent score tracking for registered users
- **Guest Mode**: Play without an account using a guest tag
- **Game Framework**: Unified framework for game development and authentication integration
- **User Profiles**: View personal statistics and game history

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