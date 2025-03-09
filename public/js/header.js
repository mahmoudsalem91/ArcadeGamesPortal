/**
 * Game header component with authentication UI
 * Handles displaying user information and navigation
 */

// Create and insert header
function createHeader(pageTitle) {
    const headerHTML = `
    <header class="game-header">
      <div class="header-container">
        <div class="logo">
          <a href="/">Arcade Games Portal</a>
        </div>
        <h1 class="game-title">${pageTitle || 'Arcade Game'}</h1>
        <div id="user-info" class="user-info">
          <!-- User info will be populated by auth.js -->
          <button id="show-auth-btn" class="login-btn">Login / Register</button>
        </div>
      </div>
    </header>
  `;

    // Create header styles if not already in the document
    if (!document.getElementById('header-styles')) {
        const headerStyles = `
      <style id="header-styles">
        .game-header {
          background-color: #0f1428;
          padding: 1rem;
          border-bottom: 2px solid rgba(248, 188, 52, 0.3);
        }
        
        .header-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .logo a {
          color: #f8bc34;
          font-size: 1.2rem;
          font-weight: bold;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        
        .logo a:hover {
          text-shadow: 0 0 10px rgba(248, 188, 52, 0.5);
        }
        
        .game-title {
          color: #ffffff;
          font-size: 1.5rem;
          margin: 0;
        }
        
        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .user-info span {
          color: #8f9bba;
        }
        
        .login-btn, .logout-btn {
          background-color: #f8bc34;
          color: #0a0e23;
          border: none;
          border-radius: 5px;
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .login-btn:hover {
          background-color: #ffcf5c;
          transform: translateY(-2px);
        }
        
        .logout-btn {
          background-color: transparent;
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .logout-btn:hover {
          background-color: rgba(255, 255, 255, 0.1);
          border-color: #ffffff;
        }
        
        @media (max-width: 768px) {
          .header-container {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .game-title {
            font-size: 1.2rem;
          }
        }
      </style>
    `;

        document.head.insertAdjacentHTML('beforeend', headerStyles);
    }

    // Insert header at the beginning of the body
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
}

// Initialize header when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get page title from the document title
    const pageTitle = document.title;
    createHeader(pageTitle);
}); 