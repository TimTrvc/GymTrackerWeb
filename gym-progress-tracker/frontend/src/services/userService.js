import BaseService from './BaseService';
import { USER_ENDPOINTS } from '@/config/apiEndpoints';

/**
 * Service für die Verwaltung von Benutzerdaten
 * Verwendet zentrale API-Endpunkte (DRY-Prinzip)
 */
class UserService extends BaseService {
  /**
   * Konstruktor für den User Service
   */
  constructor() {
    super(USER_ENDPOINTS.BASE);
  }

  /**
   * Holt Benutzerdetails nach ID
   * @param {number} userId - Die Benutzer-ID
   * @returns {Promise<Object>} - Benutzerdetails
   */
  async getUserDetails(userId) {
    try {
      const data = await this.get(`${userId}`);
      return data.user;
    } catch (error) {
      this.handleError(error, `Fehler beim Abrufen der Benutzerdetails für ID ${userId}`);
    }
  }

  /**
   * Aktualisiert Benutzerdetails
   * @param {number} userId - Die Benutzer-ID
   * @param {Object} userData - Aktualisierte Benutzerdaten
   * @returns {Promise<Object>} - Aktualisierte Benutzerdetails
   */
  async updateUserDetails(userId, userData) {
    try {
      return await this.put(`${userId}`, userData);
    } catch (error) {
      this.handleError(error, `Fehler beim Aktualisieren der Benutzerdetails für ID ${userId}`);
    }
  }
}

// Singleton-Instanz des Services exportieren
const userService = new UserService();
export default userService;

// Kompatibilitätsexporte für bisherige direkte Funktionsaufrufe
export const getUserDetails = (userId) => userService.getUserDetails(userId);
export const updateUserDetails = (userId, userData) => userService.updateUserDetails(userId, userData);