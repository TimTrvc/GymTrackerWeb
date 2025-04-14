import BaseService from './BaseService';
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
 * Service für die Benutzerauthentifizierung
 * Implementiert zentrale Authentifizierungslogik
 */
class AuthService extends BaseService {
  /**
   * Konstruktor für den Auth Service
   */
  constructor() {
    super(USER_ENDPOINTS.BASE);
  }

  /**
   * Benutzer-Login mit Credentials
   * @param {object} credentials - Anmeldedaten (Email und Passwort)
   * @param {boolean} rememberMe - Remember-Me-Flag
   * @returns {Promise<object>} - Benutzer-Objekt
   */
  async login(credentials, rememberMe = false) {
    try {
      const data = await this.post('login', credentials);
      saveAuthData(data, rememberMe);
      return data.user;
    } catch (error) {
      this.handleError(error, 'Login fehlgeschlagen');
    }
  }

  /**
   * Registrierung eines neuen Benutzers
   * @param {object} userData - Registrierungsdaten
   * @returns {Promise<object>} - Benutzer-Objekt
   */
  async register(userData) {
    try {
      const data = await this.post('register', userData);
      saveAuthData(data);
      return data.user;
    } catch (error) {
      this.handleError(error, 'Registrierung fehlgeschlagen');
    }
  }

  /**
   * Benutzer-Logout
   */
  logout() {
    localStorage.removeItem(AUTH_KEYS.TOKEN);
    localStorage.removeItem(AUTH_KEYS.USER_ID);
    localStorage.removeItem(AUTH_KEYS.USERNAME);
    localStorage.removeItem(AUTH_KEYS.REMEMBER_ME);
  }

  /**
   * Prüft, ob der Benutzer angemeldet ist
   * @returns {boolean} - Authentication status
   */
  isAuthenticated() {
    return !!localStorage.getItem(AUTH_KEYS.TOKEN);
  }

  /**
   * Aktuelle Benutzerinformationen abrufen
   * @returns {Promise<object>} - Benutzer-Objekt
   */
  async getCurrentUser() {
    try {
      if (!this.isAuthenticated()) {
        return null;
      }
      return await this.get('me');
    } catch (error) {
      this.handleError(error, 'Fehler beim Abrufen des aktuellen Benutzers');
      return null;
    }
  }

  /**
   * Aktualisiert das Benutzerprofil
   * @param {object} profileData - Aktualisierte Profildaten
   * @returns {Promise<object>} - Aktualisiertes Benutzer-Objekt
   */
  async updateProfile(profileData) {
    try {
      return await this.put('profile', profileData);
    } catch (error) {
      this.handleError(error, 'Fehler beim Aktualisieren des Profils');
    }
  }
}

// Singleton-Instanz des Services exportieren
const authService = new AuthService();

export default authService;

// Kompatibilitätsexporte für bisherige direkte Funktionsaufrufe
export const login = (credentials, rememberMe) => authService.login(credentials, rememberMe);
export const register = (userData) => authService.register(userData);
export const logout = () => authService.logout();
export const isAuthenticated = () => authService.isAuthenticated();
export const getCurrentUser = () => authService.getCurrentUser();
export const updateProfile = (profileData) => authService.updateProfile(profileData);
