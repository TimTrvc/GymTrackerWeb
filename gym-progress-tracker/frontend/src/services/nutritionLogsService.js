import api from "./api.js";

/**
 * Fetches all nutrition logs from the backend API.
 * @returns {Promise<Array>} Array of nutrition log objects.
 * @throws Will log and suppress errors if fetching fails.
 */
export const getNutritionLogs = async () => {
  try {
    const response = await api.get('/api/nutrition-logs');
    if (response) {
      return response.data;
    }
  } catch (error) {
    console.error('Error fetching nutrition logs:', error);
  }
};

/**
 * Adds a new nutrition log entry.
 * @param {Object} logData - The nutrition log data to add.
 * @returns {Promise<Object>} The created nutrition log object.
 * @throws Will log and rethrow errors if adding fails.
 */
export const addNutritionLog = async (logData) => {
  try {
    const response = await api.post('/api/nutrition-logs', logData);
    return response.data;
  } catch (error) {
    console.error('Error adding nutrition log:', error);
    throw error;
  }
};

/**
 * Deletes a nutrition log entry by its ID.
 * @param {string|number} nutritionLogId - The ID of the nutrition log to delete.
 * @returns {Promise<Object>} The response from the API.
 * @throws Will log and rethrow errors if deletion fails.
 */
export const deleteNutritionLog = async (nutritionLogId) => {
  try {
    const response = await api.delete(`/api/nutrition-logs/${nutritionLogId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting nutrition log:', error);
    throw error;
  }
};