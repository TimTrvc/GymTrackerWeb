document.addEventListener('DOMContentLoaded', function() {
  renderNavigation();
  protectPage();

  const token = localStorage.getItem('token');
  const loginButton = document.getElementById('login-button');
  const logoutButton = document.getElementById('logout-button');

  if (token) {
    // Benutzer ist angemeldet
    if (loginButton) loginButton.style.display = 'none';
    if (logoutButton) {
      logoutButton.style.display = 'block';
      logoutButton.addEventListener('click', logout);
    }
  } else {
    // Benutzer ist nicht angemeldet
    if (loginButton) loginButton.style.display = 'block';
    if (logoutButton) logoutButton.style.display = 'none';
  }
});

function isLoggedIn() {
  return localStorage.getItem('token') !== null;
}

function renderNavigation() {
  const navElement = document.querySelector('nav .flex.items-center.space-x-4');
  if (!navElement) return;

  if (isLoggedIn()) {
    // Für eingeloggte Benutzer
    navElement.innerHTML = `
      <a href="../index.html" class="hover:text-indigo-200">Dashboard</a>
      <a href="sites/workout.html" class="hover:text-indigo-200">Workouts</a>
      <a href="sites/exercises.html" class="hover:text-indigo-200">Übungen</a>
      <a href="#" class="hover:text-indigo-200">Statistiken</a>
      <a href="#" class="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100" id="logout-btn">Logout</a>
    `;

    // Logout-Funktion hinzufügen
    document.getElementById('logout-btn')?.addEventListener('click', function(e) {
      e.preventDefault();
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      window.location.href = '../index.html';
    });
  } else {
    // Für nicht eingeloggte Benutzer
    navElement.innerHTML = `
      <a href="/sites/login.html" class="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100">Login</a>
    `;
  }
}

function protectPage() {
  // Liste der geschützten Pfade
  const protectedPaths = ['workout.html', 'exercises.html', 'statistics.html'];

  // Aktueller Pfad
  const currentPath = window.location.pathname.split('/').pop();

  if (protectedPaths.includes(currentPath) && !isLoggedIn()) {
    // Benutzer ist nicht eingeloggt, aber versucht auf geschützte Seite zuzugreifen
    window.location.href = '/sites/login.html';
  }
}

// In der auth.js eine neue Funktion hinzufügen:
function logout() {
  // Token aus dem localStorage entfernen
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  // Zur Login-Seite umleiten
  window.location.href = '/sites/login.html';
}


// Exportieren der Funktionen
//export {isLoggedIn, renderNavigation, protectPage};
