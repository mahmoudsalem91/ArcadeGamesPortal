# Changelog

All notable changes to the Arcade Games Portal project will be documented in this file.

## [Unreleased]

### Planned Features
- Complete Brick Breaker game implementation
- Implement real-time API for leaderboards
- Add user achievement system
- Comprehensive cross-browser testing

## [0.1.0] - 2025-03-09

### Added
- Initial project setup
- MongoDB schema design
- Authentication system backend implementation
- Basic frontend authentication UI
- Project documentation
- Apache server configuration for static file serving
- HTTPS with SSL certificates
- Proxy configuration for API requests
- TypeScript build process
- Game framework for authentication integration
- Snake game implementation
- User profile page with statistics
- Dynamic score tracking for Snake game
- User score highlighting in global leaderboard
- LocalStorage-based score persistence
- Game score history in user profiles
- Cache-busting mechanism using PHP timestamps
- Responsive layout improvements for different screen sizes
- Pong game implementation
- Global leaderboard on main page
- Coming soon pages for unreleased games
- UI improvements for consistent styling

### Changed
- Improved user authentication persistence
- Enhanced JSON data handling for user information
- Refactored CSS layout for proper element containment
- Updated documentation to reflect current project status
- Modified leaderboard to dynamically load from localStorage
- Improved logout functionality to handle both string and JSON user data
- Enhanced Snake game with better graphics
- Improved MIME type handling for assets

### Fixed
- Fixed leaderboard positioning issues (BUG-005)
- Fixed user JSON data appearing in logout button (BUG-006)
- Fixed profile page not recognizing logged-in state (BUG-007)
- Fixed leaderboard not showing user game scores (BUG-008)
- Fixed caching issues with game assets not refreshing (BUG-009)
- Authentication state persistence between pages (BUG-004)
- MIME type issues for CSS and JS files (BUG-003)
- "Forbidden" error due to incorrect DocumentRoot (BUG-002)
- Apache configuration error with SSLStaplingCache directive (BUG-001)

### Known Issues
- Browser compatibility: Some older browsers may display CSS issues
- Mobile touch controls need further optimization
- Leaderboards require page refresh to show new scores from other players
- No offline gameplay capability implemented yet
- Game performance may vary on low-end devices
