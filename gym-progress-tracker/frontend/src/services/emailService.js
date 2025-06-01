import BaseService from './BaseService';
import { OTHER_ENDPOINTS } from '@/config/apiEndpoints';

/**
 * Service for managing newsletter subscriptions and email functionalities.
 * Follows the Single Responsibility Principle by focusing on email-related functions.
 */
class EmailService extends BaseService {
  constructor() {
    super(OTHER_ENDPOINTS.EMAIL);
  }

  /**
   * Subscribes a user to the newsletter.
   * @param {string} email - The user's email address.
   * @returns {Promise<Object>} Result of the newsletter subscription.
   */
  async subscribeToNewsletter(email) {
    return this.post('', { email });
  }
}

// Export singleton instance of the service
const emailService = new EmailService();
export default emailService;

// Compatibility export for easy usage
/**
 * Subscribes a user to the newsletter (shortcut function).
 * @param {string} email
 * @returns {Promise<Object>}
 */
export const subscribeToNewsletter = (email) => emailService.subscribeToNewsletter(email);
