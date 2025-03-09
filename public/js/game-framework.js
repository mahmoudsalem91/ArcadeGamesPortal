/**
 * Game Framework - Handles integration with authentication system
 * This framework provides common functionality for all games
 */

class GameFramework {
    /**
     * Initialize a new game
     * @param {string} gameId - Unique identifier for the game
     * @param {object} options - Game options
     */
    constructor(gameId, options = {}) {
        this.gameId = gameId;
        this.options = Object.assign({
            highScoreLimit: 10, // Number of scores to show in leaderboard
            requireAuth: false, // Whether authentication is required to play
            showLeaderboard: true, // Whether to show the leaderboard
            saveScores: true, // Whether to save scores
        }, options);

        this.gameContainer = null;
        this.leaderboardContainer = null;
        this.gameOverModal = null;
        this.playerInfo = null;
        this.isAuthenticated = false;
        this.currentScore = 0;
        this.gameStartTime = null;

        // Bind methods
        this.init = this.init.bind(this);
        this.checkAuthState = this.checkAuthState.bind(this);
        this.showAuthPrompt = this.showAuthPrompt.bind(this);
        this.startGame = this.startGame.bind(this);
        this.endGame = this.endGame.bind(this);
        this.submitScore = this.submitScore.bind(this);
        this.fetchLeaderboard = this.fetchLeaderboard.bind(this);
        this.updateLeaderboard = this.updateLeaderboard.bind(this);
        this.createGameOverModal = this.createGameOverModal.bind(this);

        // Initialize when document is loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', this.init);
        } else {
            this.init();
        }
    }

    /**
     * Initialize the game framework
     */
    init() {
        console.log(`Initializing game: ${this.gameId}`);

        // Create containers
        this.createContainers();

        // Check authentication state
        this.checkAuthState();

        // Create game over modal
        this.createGameOverModal();

        // Fetch initial leaderboard
        if (this.options.showLeaderboard) {
            this.fetchLeaderboard();
        }
    }

    /**
     * Create necessary containers for the game
     */
    createContainers() {
        // Create game container if not provided
        if (!document.getElementById('game-container')) {
            const container = document.createElement('div');
            container.id = 'game-container';
            container.className = 'game-container';
            document.body.appendChild(container);
        }
        this.gameContainer = document.getElementById('game-container');

        // Create leaderboard container if enabled
        if (this.options.showLeaderboard && !document.getElementById('leaderboard-container')) {
            const leaderboard = document.createElement('div');
            leaderboard.id = 'leaderboard-container';
            leaderboard.className = 'leaderboard-container';
            leaderboard.innerHTML = `
        <h2>Leaderboard</h2>
        <div id="leaderboard-content" class="leaderboard-content">
          <p>Loading scores...</p>
        </div>
      `;
            document.body.appendChild(leaderboard);
        }
        this.leaderboardContainer = document.getElementById('leaderboard-container');

        // Create player info container
        if (!document.getElementById('player-info')) {
            const playerInfo = document.createElement('div');
            playerInfo.id = 'player-info';
            playerInfo.className = 'player-info';
            document.body.appendChild(playerInfo);
        }
        this.playerInfo = document.getElementById('player-info');
    }

    /**
     * Check if user is authenticated
     */
    checkAuthState() {
        // Check if gameAuth is available (from auth.js)
        if (window.gameAuth) {
            this.isAuthenticated = window.gameAuth.isAuthenticated();

            // If authentication is required and user is not authenticated
            if (this.options.requireAuth && !this.isAuthenticated) {
                this.showAuthPrompt();
                return;
            }

            // Update player info
            this.updatePlayerInfo();
        } else {
            console.warn('gameAuth not found. Authentication features will be disabled.');
        }
    }

    /**
     * Update the player info display
     */
    updatePlayerInfo() {
        if (!this.playerInfo) return;

        if (window.gameAuth) {
            const userInfo = window.gameAuth.getCurrentUserInfo();

            if (userInfo) {
                if (userInfo.isGuest) {
                    this.playerInfo.innerHTML = `<span>Playing as: <strong>${userInfo.guestTag}</strong></span>`;
                } else {
                    this.playerInfo.innerHTML = `<span>Player: <strong>${userInfo.username || 'User'}</strong></span>`;
                }
            } else {
                this.playerInfo.innerHTML = `
          <span>Not logged in</span>
          <button id="login-button" class="login-button">Login / Sign Up</button>
        `;

                // Add event listener for login button
                setTimeout(() => {
                    const loginButton = document.getElementById('login-button');
                    if (loginButton) {
                        loginButton.addEventListener('click', () => {
                            window.gameAuth.showAuthModal();
                        });
                    }
                }, 0);
            }
        }
    }

    /**
     * Show authentication prompt
     */
    showAuthPrompt() {
        if (window.gameAuth) {
            window.gameAuth.showAuthModal();
        }
    }

    /**
     * Start a new game
     */
    startGame() {
        console.log(`Starting game: ${this.gameId}`);
        this.currentScore = 0;
        this.gameStartTime = Date.now();

        // This method should be overridden by the game implementation
    }

    /**
     * End the current game
     * @param {number} score - Final score
     */
    endGame(score) {
        console.log(`Game over. Score: ${score}`);
        this.currentScore = score;

        // Calculate game duration in seconds
        const duration = Math.floor((Date.now() - this.gameStartTime) / 1000);

        // Show game over modal
        this.showGameOverModal(score, duration);

        // Submit score if enabled
        if (this.options.saveScores) {
            this.submitScore(score, duration);
        }
    }

    /**
     * Submit score to the server
     * @param {number} score - Final score
     * @param {number} duration - Game duration in seconds
     */
    async submitScore(score, duration) {
        if (window.gameAuth) {
            try {
                const result = await window.gameAuth.submitScore(this.gameId, score, duration);
                if (result) {
                    console.log('Score submitted successfully');
                    // Refresh leaderboard
                    this.fetchLeaderboard();
                } else {
                    console.warn('Failed to submit score');
                }
            } catch (error) {
                console.error('Error submitting score:', error);
            }
        } else {
            console.warn('gameAuth not found. Score submission disabled.');
        }
    }

    /**
     * Fetch leaderboard data from the server
     */
    async fetchLeaderboard() {
        if (!this.leaderboardContainer) return;

        try {
            const response = await fetch(`/api/scores/${this.gameId}?limit=${this.options.highScoreLimit}`);
            const data = await response.json();

            this.updateLeaderboard(data);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            if (this.leaderboardContainer) {
                this.leaderboardContainer.innerHTML = `
          <h2>Leaderboard</h2>
          <p>Failed to load scores</p>
        `;
            }
        }
    }

    /**
     * Update the leaderboard display
     * @param {Array} scores - Array of score objects
     */
    updateLeaderboard(scores) {
        if (!this.leaderboardContainer) return;

        const leaderboardContent = document.getElementById('leaderboard-content');
        if (!leaderboardContent) return;

        if (!scores || scores.length === 0) {
            leaderboardContent.innerHTML = '<p>No scores yet. Be the first to play!</p>';
            return;
        }

        let html = '<table><thead><tr><th>Rank</th><th>Player</th><th>Score</th></tr></thead><tbody>';

        scores.forEach((score, index) => {
            const isCurrentUser = window.gameAuth && window.gameAuth.getCurrentUserInfo() &&
                ((!window.gameAuth.getCurrentUserInfo().isGuest && score.player === window.gameAuth.getCurrentUserInfo().username) ||
                    (window.gameAuth.getCurrentUserInfo().isGuest && score.player === window.gameAuth.getCurrentUserInfo().guestTag));

            html += `<tr class="${isCurrentUser ? 'current-user' : ''}">
        <td>${index + 1}</td>
        <td>${score.player}${score.isGuest ? ' (Guest)' : ''}</td>
        <td>${score.score}</td>
      </tr>`;
        });

        html += '</tbody></table>';
        leaderboardContent.innerHTML = html;
    }

    /**
     * Create the game over modal
     */
    createGameOverModal() {
        if (document.getElementById('game-over-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'game-over-modal';
        modal.className = 'game-over-modal';
        modal.style.display = 'none';

        modal.innerHTML = `
      <div class="game-over-content">
        <h2>Game Over</h2>
        <p>Your score: <span id="final-score">0</span></p>
        <div id="game-over-buttons">
          <button id="play-again-btn" class="play-again-btn">Play Again</button>
          <button id="main-menu-btn" class="main-menu-btn">Main Menu</button>
        </div>
      </div>
    `;

        document.body.appendChild(modal);
        this.gameOverModal = modal;

        // Add event listeners
        document.getElementById('play-again-btn').addEventListener('click', () => {
            this.hideGameOverModal();
            this.startGame();
        });

        document.getElementById('main-menu-btn').addEventListener('click', () => {
            window.location.href = '/';
        });
    }

    /**
     * Show the game over modal
     * @param {number} score - Final score
     * @param {number} duration - Game duration in seconds
     */
    showGameOverModal(score, duration) {
        if (!this.gameOverModal) return;

        const finalScoreElement = document.getElementById('final-score');
        if (finalScoreElement) {
            finalScoreElement.textContent = score;
        }

        this.gameOverModal.style.display = 'flex';
    }

    /**
     * Hide the game over modal
     */
    hideGameOverModal() {
        if (!this.gameOverModal) return;
        this.gameOverModal.style.display = 'none';
    }

    /**
     * Set the current score
     * @param {number} score - Current score
     */
    setScore(score) {
        this.currentScore = score;
        // Update score display if available
        const scoreDisplay = document.getElementById('score-display');
        if (scoreDisplay) {
            scoreDisplay.textContent = score;
        }
    }
}

// Export the class for use in games
window.GameFramework = GameFramework; 