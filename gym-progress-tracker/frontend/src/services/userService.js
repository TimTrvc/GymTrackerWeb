import api from './api';

/**
 * Get user details by ID
 * @param {number} userId - The user ID
 * @returns {Promise<Object>} User details
 */
export const getUserDetails = async (userId) => {
  try {
    const response = await api.get(`/api/users/${userId}`);
    return response.data.user;
  } catch (error) {
    console.error('Error in getUserDetails:', error);
    throw error;
  }
};

/**
 * Update user details
 * @param {number} userId - The user ID
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} Updated user details
 */
export const updateUserDetails = async (userId, userData) => {
  try {
    // Fix the URL path to include /api prefix
    const response = await api.put(`/api/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error in updateUserDetails:', error);
    throw error;
  }
};