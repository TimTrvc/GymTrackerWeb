import BaseService from './BaseService';
import { OTHER_ENDPOINTS } from '@/config/apiEndpoints';

/**
 * Service für die Verwaltung von Newsletter-Abonnements und E-Mail-Funktionalitäten
 * Folgt dem Single Responsibility Principle durch Fokus auf E-Mail-bezogene Funktionen
 */
class EmailService extends BaseService {
  constructor() {
    super(OTHER_ENDPOINTS.email);
  }

  /**
   * Abonniert einen Benutzer für den Newsletter
   * @param {string} email - E-Mail-Adresse des Benutzers
   * @returns {Promise<Object>} - Ergebnis der Newsletter-Anmeldung
   */
  async subscribeToNewsletter(email) {
    return this.post('', { email });
  }
}

// Singleton-Instanz des Services exportieren
const emailService = new EmailService();
export default emailService;

// Kompatibilitätsexporte für einfache Nutzung
export const subscribeToNewsletter = (email) => emailService.subscribeToNewsletter(email);
