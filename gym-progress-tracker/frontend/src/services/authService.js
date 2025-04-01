import api from './api';

/**
 * Benutzeranmeldung
 * @param {object} credentials - Anmeldedaten (username, password, rememberMe)
 * @returns {Promise} - Nutzer und Token Daten
 */
export const login = async (credentials) => {
  try {
    const response = await api.post('/api/users/login', {
      username: credentials.username,
      password: credentials.password
    });

    // Speichern der Authentifizierungsdaten im localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user.id);
      localStorage.setItem('username', response.data.user.username);

      // Optional: Remember Me Funktionalität
      if (credentials.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }
    }

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || 'Anmeldung fehlgeschlagen'
    );
  }
};

/**
 * Benutzerregistrierung
 * @param {object} userData - Registrierungsdaten
 * @returns {Promise} - Registrierungsantwort
 */
export const register = async (userData) => {
  try {
    // Validierung der Pflichtfelder
    const requiredFields = ['username', 'email', 'password'];
    for (const field of requiredFields) {
      if (!userData[field]) {
        throw new Error(`Bitte fülle alle Pflichtfelder aus. ${field} fehlt.`);
      }
    }

    // Überprüfung der Passwörter
    if (userData.password !== userData.confirmPassword) {
      throw new Error('Die Passwörter stimmen nicht überein.');
    }

    const response = await api.post('/api/users/register', userData);

    // Automatische Anmeldung nach erfolgreicher Registrierung
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user.id);
      localStorage.setItem('username', response.data.user.username);
    }

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || 'Registrierung fehlgeschlagen'
    );
  }
};

/**
 * Prüft, ob der Benutzer angemeldet ist
 * @returns {boolean}
 */
export const isLoggedIn = () => {
  return !!localStorage.getItem('token');
};

/**
 * Abmelden des aktuellen Benutzers
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  localStorage.removeItem('rememberMe');
};

/**
 * Holt den aktuellen authentifizierten Benutzer
 * @returns {Promise} - Benutzerdaten
 */
export const checkAuth = async () => {
  try {
    const response = await api.get('/api/users/me');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Authentifizierung fehlgeschlagen');
  }
};

/**
 * Holt das JWT Token aus dem localStorage
 * @returns {string|null} - Das Token oder null
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Prüft, ob das Token noch gültig ist
 * @returns {boolean}
 */
export const isTokenValid = () => {
  const token = getToken();
  if (!token) return false;

  try {
    // Token-Gültigkeit prüfen (vereinfacht)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp > Date.now() / 1000;
  } catch (e) {
    console.error('Error while checking Token: ' + e);
    return false;
  }
};

/**
 * Aktualisiert das Benutzerprofil
 * @param {object} userData - Aktualisierte Benutzerdaten
 * @returns {Promise}
 */
export const updateProfile = async (userData) => {
  try {
    const response = await api.put('/api/users/profile', userData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || 'Profilaktualisierung fehlgeschlagen'
    );
  }
};
