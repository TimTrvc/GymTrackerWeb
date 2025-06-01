
/**
 * Initializes navigation and page protection on DOMContentLoaded.
 */
document.addEventListener('DOMContentLoaded', function() {
  renderNavigation();
  protectPage();

  const token = localStorage.getItem('token');
  const loginButton = document.getElementById('login-button');
  const logoutButton = document.getElementById('logout-button');

  if (token) {
    // User is logged in
    if (loginButton) loginButton.style.display = 'none';
    if (logoutButton) {
      logoutButton.style.display = 'block';
      logoutButton.addEventListener('click', logout);
    }
  } else {
    // User is not logged in
    if (loginButton) loginButton.style.display = 'block';
    if (logoutButton) logoutButton.style.display = 'none';
  }
});


/**
 * Checks if the user is logged in.
 * @returns {boolean} True if logged in, false otherwise.
 */
function isLoggedIn() {
  return localStorage.getItem('token') !== null;
}


/**
 * Returns the path prefix depending on the current location.
 * @returns {string} Path prefix for navigation links.
 */
function getPathPrefix() {
  // Checks if the current page is in the /sites/ folder
  return window.location.pathname.includes('/sites/') ? '' : 'sites/';
}


/**
 * Renders the navigation bar based on authentication state.
 */
function renderNavigation() {
  const navElement = document.querySelector('nav .flex.items-center.space-x-4');
  if (!navElement) return;

  const prefix = getPathPrefix(); // either '' or 'sites/'

  if (isLoggedIn()) {
    navElement.innerHTML = `
      <a href="${prefix}dashboard.html" class="hover:text-indigo-200">Dashboard</a>
      <a href="${prefix}workout.html" class="hover:text-indigo-200">Workouts</a>
      <a href="${prefix}exercises.html" class="hover:text-indigo-200">Exercises</a>
      <a href="${prefix}statistics.html" class="hover:text-indigo-200">Statistics</a>
      <a href="#" class="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100" id="logout-btn">Logout</a>
    `;

    // Add logout functionality
    document.getElementById('logout-btn')?.addEventListener('click', function(e) {
      e.preventDefault();
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      window.location.href = '../index.html';
    });
  } else {
    // For unauthenticated users
    navElement.innerHTML = `
      <a href="/sites/login.html" class="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100">Login</a>
    `;
  }
}


/**
 * Protects pages that require authentication.
 * Redirects to login if not authenticated.
 */
function protectPage() {
  // List of protected paths
  const protectedPaths = ['workout.html', 'exercises.html', 'statistics.html','dashboard.html'];

  // Current path
  const currentPath = window.location.pathname.split('/').pop();

  if (protectedPaths.includes(currentPath) && !isLoggedIn()) {
    // User is not logged in but tries to access a protected page
    window.location.href = '/sites/login.html';
  }
}


/**
 * Logs out the user by clearing tokens and redirecting to login page.
 */
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/sites/login.html';
}


// Exportieren der Funktionen
//export {isLoggedIn, renderNavigation, protectPage};
