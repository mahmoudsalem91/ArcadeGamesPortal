/**
 * Authentication module for Arcade Games Portal
 * Handles user registration, login, and guest mode
 */

// Create a global authentication module
window.gameAuth = window.gameAuth || {};

// Base API URL
const API_BASE_URL = '/api';

// Auth state
let currentUser = null;
let isGuest = false;
let guestTag = '';

// DOM elements - will be initialized when document is loaded
let authOverlay;
let authModal;
let loginTab;
let registerTab;
let loginForm;
let registerForm;
let guestForm;
let authError;

// Flag to track if we've already initialized auth
let authInitialized = false;

/**
 * Initialize the authentication module
 */
function initAuth() {
    // Prevent double initialization
    if (authInitialized) {
        console.log('Auth already initialized, skipping');
        return;
    }

    console.log('Initializing auth module');

    // Check for existing authentication FIRST - this must happen before anything else
    // This sets currentUser and isGuest values
    checkAuthState();

    // Create auth modal if it doesn't exist
    if (!document.getElementById('auth-overlay')) {
        createAuthModal();
    }

    // Cache DOM elements
    authOverlay = document.getElementById('auth-overlay');
    authModal = document.getElementById('auth-modal');
    loginTab = document.getElementById('login-tab');
    registerTab = document.getElementById('register-tab');
    loginForm = document.getElementById('login-form');
    registerForm = document.getElementById('register-form');
    guestForm = document.getElementById('guest-form');
    authError = document.getElementById('auth-error');

    // Add event listeners
    loginTab.addEventListener('click', () => showAuthTab('login'));
    registerTab.addEventListener('click', () => showAuthTab('register'));
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    guestForm.addEventListener('submit', handleGuestMode);
    document.getElementById('guest-mode-btn').addEventListener('click', () => showAuthTab('guest'));

    // Show auth modal on page load ONLY if not authenticated
    // We check both currentUser and isGuest to determine if authentication exists
    if (!isAuthenticated()) {
        console.log('No authentication found, showing login modal');
        showAuthModal();
    } else {
        console.log('User is authenticated:', isGuest ? `Guest: ${guestTag}` : `User: ${currentUser.username}`);
        // Make sure modal is hidden if user is authenticated
        hideAuthModal();
    }

    // Export methods to global gameAuth object
    window.gameAuth.isAuthenticated = isAuthenticated;
    window.gameAuth.getCurrentUserInfo = getCurrentUserInfo;
    window.gameAuth.submitScore = submitScore;
    window.gameAuth.showAuthModal = showAuthModal;
    window.gameAuth.hideAuthModal = hideAuthModal;
    window.gameAuth.logout = handleLogout;
    window.gameAuth.switchUser = handleSwitchUser;

    // Mark as initialized so we don't do this again
    authInitialized = true;
}

/**
 * Create the authentication modal
 */
function createAuthModal() {
    const modalHTML = `
    <div id="auth-overlay" class="auth-overlay">
      <div id="auth-modal" class="auth-modal">
        <div class="auth-header">
          <h2>Welcome to Arcade Games</h2>
          <p>Sign in or play as a guest to track your scores</p>
        </div>
        
        <div class="auth-tabs">
          <div id="login-tab" class="auth-tab active">Login</div>
          <div id="register-tab" class="auth-tab">Register</div>
        </div>
        
        <div id="auth-error" class="auth-form-error" style="display: none; text-align: center; margin-bottom: 1rem;"></div>
        
        <!-- Login Form -->
        <form id="login-form" class="auth-form">
          <div class="auth-form-group">
            <label for="login-email">Email</label>
            <input type="email" id="login-email" required placeholder="Enter your email">
          </div>
          
          <div class="auth-form-group">
            <label for="login-password">Password</label>
            <input type="password" id="login-password" required placeholder="Enter your password">
          </div>
          
          <button type="submit" class="auth-submit-btn">Login</button>
          
          <div class="auth-divider">
            <span>OR</span>
          </div>
          
          <button type="button" id="guest-mode-btn" class="auth-guest-btn">Continue as Guest</button>
        </form>
        
        <!-- Register Form -->
        <form id="register-form" class="auth-form" style="display: none;">
          <div class="auth-form-group">
            <label for="register-username">Username</label>
            <input type="text" id="register-username" required minlength="3" maxlength="20" placeholder="Choose a username">
          </div>
          
          <div class="auth-form-group">
            <label for="register-email">Email</label>
            <input type="email" id="register-email" required placeholder="Enter your email">
          </div>
          
          <div class="auth-form-group">
            <label for="register-password">Password</label>
            <input type="password" id="register-password" required minlength="6" placeholder="Create a password (min 6 characters)">
          </div>
          
          <button type="submit" class="auth-submit-btn">Create Account</button>
          
          <div class="auth-divider">
            <span>OR</span>
          </div>
          
          <button type="button" id="guest-mode-btn-register" class="auth-guest-btn">Continue as Guest</button>
        </form>
        
        <!-- Guest Form -->
        <form id="guest-form" class="guest-form" style="display: none;">
          <p>Enter a name tag to play as a guest. Your scores will be saved with this tag.</p>
          
          <div class="auth-form-group">
            <label for="guest-tag">Name Tag (min 3 characters)</label>
            <input type="text" id="guest-tag" required minlength="3" maxlength="20" placeholder="Enter a name tag">
          </div>
          
          <button type="submit" class="auth-submit-btn">Start Playing</button>
          
          <div class="auth-divider">
            <span>OR</span>
          </div>
          
          <button type="button" id="back-to-login" class="auth-guest-btn">Back to Login</button>
        </form>
      </div>
    </div>
  `;

    // Add modal to the document
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer.firstElementChild);

    // Add event listener for the "back to login" button
    setTimeout(() => {
        document.getElementById('back-to-login').addEventListener('click', () => showAuthTab('login'));
        document.getElementById('guest-mode-btn-register').addEventListener('click', () => showAuthTab('guest'));
    }, 0);
}

/**
 * Show the authentication modal
 */
function showAuthModal() {
    // Don't show the modal if the user is already authenticated
    if (isAuthenticated()) {
        console.log('User is already authenticated, not showing auth modal');
        return;
    }

    console.log('Showing auth modal');
    if (authOverlay) {
        authOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    } else {
        console.error('Auth overlay not found when trying to show modal');
    }
}

/**
 * Hide the authentication modal
 */
function hideAuthModal() {
    console.log('Hiding auth modal');
    if (authOverlay) {
        authOverlay.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
    } else {
        console.error('Auth overlay not found when trying to hide modal');
    }
}

/**
 * Show a specific tab in the auth modal
 */
function showAuthTab(tab) {
    // Hide all forms
    loginForm.style.display = 'none';
    registerForm.style.display = 'none';
    guestForm.style.display = 'none';

    // Remove active class from all tabs
    loginTab.classList.remove('active');
    registerTab.classList.remove('active');

    // Show selected form and activate tab
    if (tab === 'login') {
        loginForm.style.display = 'flex';
        loginTab.classList.add('active');
    } else if (tab === 'register') {
        registerForm.style.display = 'flex';
        registerTab.classList.add('active');
    } else if (tab === 'guest') {
        guestForm.style.display = 'flex';
    }

    // Clear any error messages
    hideError();
}

/**
 * Display an error message
 */
function showError(message) {
    authError.textContent = message;
    authError.style.display = 'block';
}

/**
 * Hide the error message
 */
function hideError() {
    authError.style.display = 'none';
}

/**
 * Handle login form submission
 */
async function handleLogin(event) {
    event.preventDefault();
    hideError();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        // Save user data and token
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
            id: data._id,
            username: data.username,
            email: data.email
        }));

        // Update current state
        currentUser = {
            id: data._id,
            username: data.username,
            email: data.email
        };
        isGuest = false;
        guestTag = '';

        // Hide modal
        hideAuthModal();

        // Update UI
        updateAuthUI();

        console.log('Login successful:', currentUser.username);
    } catch (error) {
        console.error('Login error:', error);
        showError(error.message);
    }
}

/**
 * Handle register form submission
 */
async function handleRegister(event) {
    event.preventDefault();
    hideError();

    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        // Save user data and token
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
            id: data._id,
            username: data.username,
            email: data.email
        }));

        // Update auth state
        currentUser = {
            id: data._id,
            username: data.username,
            email: data.email
        };
        isGuest = false;
        guestTag = '';

        // Hide modal
        hideAuthModal();

        // Update UI
        updateAuthUI();

        // Reload page if needed
        // window.location.reload();
    } catch (error) {
        showError(error.message);
    }
}

/**
 * Handle guest mode form submission
 */
async function handleGuestMode(event) {
    event.preventDefault();
    hideError();

    const guestTagInput = document.getElementById('guest-tag').value;

    if (guestTagInput.length < 3) {
        showError('Name tag must be at least 3 characters long');
        return;
    }

    try {
        // Save guest tag
        localStorage.setItem('guestTag', guestTagInput);

        // Update current state
        currentUser = null;
        isGuest = true;
        guestTag = guestTagInput;

        // Clear any existing token
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Hide modal
        hideAuthModal();

        // Update UI
        updateAuthUI();

        console.log('Guest mode activated:', guestTag);
    } catch (error) {
        console.error('Guest mode error:', error);
        showError(error.message);
    }
}

/**
 * Check authentication state on page load
 */
function checkAuthState() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const storedGuestTag = localStorage.getItem('guestTag');

    console.log('Checking auth state:', {
        hasToken: !!token,
        hasUser: !!user,
        guestTag: storedGuestTag
    });

    if (token && user) {
        // User is logged in
        try {
            currentUser = JSON.parse(user);
            isGuest = false;
            guestTag = '';
            console.log('Found logged in user:', currentUser.username);
        } catch (e) {
            console.error('Error parsing user data from localStorage:', e);
            // Clear invalid data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            currentUser = null;
        }
    } else if (storedGuestTag) {
        // User is a guest
        currentUser = null;
        isGuest = true;
        guestTag = storedGuestTag;
        console.log('Found guest user:', guestTag);
    } else {
        // Not authenticated
        currentUser = null;
        isGuest = false;
        guestTag = '';
        console.log('No authentication found');
    }

    // Update UI based on auth state
    setTimeout(updateAuthUI, 0);
}

/**
 * Update UI based on authentication state
 */
function updateAuthUI() {
    // Update UI elements based on auth state
    const userInfoElement = document.getElementById('user-info');

    if (userInfoElement) {
        if (currentUser) {
            // Logged in user
            userInfoElement.innerHTML = `
        <span>Welcome, ${currentUser.username}</span>
        <button id="logout-btn" class="logout-btn">Logout</button>
      `;
        } else if (isGuest) {
            // Guest user
            userInfoElement.innerHTML = `
        <span>Playing as: ${guestTag}</span>
        <button id="switch-user-btn" class="logout-btn">Switch User</button>
      `;
        } else {
            // Not authenticated
            userInfoElement.innerHTML = `
        <button id="show-auth-btn" class="login-btn">Login / Register</button>
      `;
        }

        // Add event listeners for the buttons
        if (document.getElementById('logout-btn')) {
            document.getElementById('logout-btn').addEventListener('click', handleLogout);
        }

        if (document.getElementById('switch-user-btn')) {
            document.getElementById('switch-user-btn').addEventListener('click', handleSwitchUser);
        }

        if (document.getElementById('show-auth-btn')) {
            document.getElementById('show-auth-btn').addEventListener('click', showAuthModal);
        }
    }
}

/**
 * Handle user logout
 */
function handleLogout() {
    // Clear auth data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('guestTag');

    // Update auth state
    currentUser = null;
    isGuest = false;
    guestTag = '';

    // Update UI
    updateAuthUI();

    // Show auth modal
    showAuthModal();
}

/**
 * Handle switching from guest to another user
 */
function handleSwitchUser() {
    // Clear guest data
    localStorage.removeItem('guestTag');

    // Update auth state
    currentUser = null;
    isGuest = false;
    guestTag = '';

    // Update UI
    updateAuthUI();

    // Show auth modal
    showAuthModal();
}

/**
 * Get current user information
 * @returns {Object|null} User information object or null
 */
function getCurrentUserInfo() {
    if (currentUser) {
        return {
            ...currentUser,
            isGuest: false
        };
    } else if (isGuest) {
        return {
            username: guestTag,
            isGuest: true
        };
    }
    return null;
}

/**
 * Check if the user is authenticated (either as a user or guest)
 */
function isAuthenticated() {
    return currentUser !== null || isGuest === true;
}

/**
 * Submit a score
 */
async function submitScore(gameId, score, duration) {
    if (!isAuthenticated()) {
        showAuthModal();
        return false;
    }

    const userInfo = getCurrentUserInfo();

    try {
        const scoreData = {
            gameId,
            score,
            duration
        };

        // Add user ID or guest tag based on auth state
        if (userInfo.isGuest) {
            scoreData.guestTag = userInfo.guestTag;
        }

        // Send score to server
        const response = await fetch(`${API_BASE_URL}/scores`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': currentUser ? `Bearer ${localStorage.getItem('token')}` : ''
            },
            body: JSON.stringify(scoreData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Score submission failed');
        }

        return true;
    } catch (error) {
        console.error('Score submission error:', error);
        return false;
    }
}

// Initialize auth when the document is loaded
document.addEventListener('DOMContentLoaded', initAuth); 