import BaseService from './BaseService';
import { USER_ENDPOINTS } from '@/config/apiEndpoints';


/**
 * Service for managing user data.
 * Uses central API endpoints (DRY principle).
 * @class UserService
 * @extends BaseService
 */
class UserService extends BaseService {
  /**
   * Constructs the User Service.
   */
  constructor() {
    super(USER_ENDPOINTS.BASE);
  }

  /**
   * Gets user details by ID.
   * @param {number} userId - The user ID.
   * @returns {Promise<Object>} User details.
   */
  async getUserDetails(userId) {
    try {
      const data = await this.get(`${userId}`);
      return data.user;
    } catch (error) {
      this.handleError(error, `Error fetching user details for ID ${userId}`);
    }
  }

  /**
   * Updates user details.
   * @param {number} userId - The user ID.
   * @param {Object} userData - Updated user data.
   * @returns {Promise<Object>} Updated user details.
   */
  async updateUserDetails(userId, userData) {
    try {
      return await this.put(`${userId}`, userData);
    } catch (error) {
      this.handleError(error, `Error updating user details for ID ${userId}`);
    }
  }
}

// Export singleton instance of the service
const userService = new UserService();
export default userService;

// Compatibility exports for previous direct function calls
export const getUserDetails = (userId) => userService.getUserDetails(userId);
export const updateUserDetails = (userId, userData) => userService.updateUserDetails(userId, userData);