import api from './api';
import { USER_ENDPOINTS } from '@/config/apiEndpoints';
import { handleError } from '@/utils/errorHandler';

/**
 * Konstanten für localStorage Keys, um DRY zu vermeiden
 */
export const AUTH_KEYS = {
  TOKEN: 'token',
  USER_ID: 'userId',
  USERNAME: 'username',
  REMEMBER_ME: 'rememberMe'
};

/**
 * Helfer-Funktion zum Speichern von Auth-Daten (DRY-Prinzip)
 * @param {object} authData - Authentifizierungsdaten mit token und user
 * @param {boolean} rememberMe - Remember-Me-Flag
 */
const saveAuthData = (authData, rememberMe = false) => {
  if (authData?.token) {
    localStorage.setItem(AUTH_KEYS.TOKEN, authData.token);
    localStorage.setItem(AUTH_KEYS.USER_ID, authData.user.id);
    localStorage.setItem(AUTH_KEYS.USERNAME, authData.user.username);
    
    if (rememberMe) {
      localStorage.setItem(AUTH_KEYS.REMEMBER_ME, 'true');
    } else {
      localStorage.removeItem(AUTH_KEYS.REMEMBER_ME);
    }
  }
};

/**
 * Benutzeranmeldung
 * @param {object} credentials - Anmeldedaten (username, password, rememberMe)
 * @returns {Promise} - Nutzer und Token Daten
 */
export const login = async (credentials) => {
  try {
    const response = await api.post(USER_ENDPOINTS.LOGIN, {
      username: credentials.username,
      password: credentials.password
    });

    saveAuthData(response.data, credentials.rememberMe);
    return response.data;
  } catch (error) {
    throw handleError(error, 'Anmeldung fehlgeschlagen').error;
  }
};

/**
 * Benutzerregistrierung
 * @param {object} userData - Registrierungsdaten
 * @returns {Promise} - Registrierungsantwort
 */
export const register = async (userData) => {
  try {
    validateRegistrationData(userData);
    const response = await api.post(USER_ENDPOINTS.REGISTER, userData);
    
    saveAuthData(response.data);
    return response.data;
  } catch (error) {
    throw handleError(error, 'Registrierung fehlgeschlagen').error;
  }
};

/**
 * Validiert die Registrierungsdaten (Single Responsibility)
 * @param {object} userData - Die zu validierenden Benutzerdaten
 * @throws {Error} Wenn die Validierung fehlschlägt
 */
const validateRegistrationData = (userData) => {
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
};

/**
 * Prüft, ob der Benutzer angemeldet ist
 * @returns {boolean}
 */
export const isLoggedIn = () => {
  return !!localStorage.getItem(AUTH_KEYS.TOKEN);
};

/**
 * Abmelden des aktuellen Benutzers
 */
export const logout = () => {
  Object.values(AUTH_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

/**
 * Holt den aktuellen authentifizierten Benutzer
 * @returns {Promise} - Benutzerdaten
 */
export const checkAuth = async () => {
  try {
    const response = await api.get(USER_ENDPOINTS.ME);
    return response.data;
  } catch (error) {
    throw handleError(error, 'Authentifizierung fehlgeschlagen').error;
  }
};

/**
 * Holt das JWT Token aus dem localStorage
 * @returns {string|null} - Das Token oder null
 */
export const getToken = () => {
  return localStorage.getItem(AUTH_KEYS.TOKEN);
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
    const response = await api.put(USER_ENDPOINTS.PROFILE, userData);
    return response.data;
  } catch (error) {
    throw handleError(error, 'Profilaktualisierung fehlgeschlagen').error;
  }
};
