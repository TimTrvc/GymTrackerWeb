import api from "./api.js";

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

export const addNutritionLog = async (logData) => {
  try {
    const response = await api.post('/api/nutrition-logs', logData);
    return response.data;
  } catch (error) {
    console.error('Error adding nutrition log:', error);
    throw error;
  }
};

export const deleteNutritionLog = async (nutritionLogId) => {
  try {
    const response = await api.delete(`/api/nutrition-logs/${nutritionLogId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting nutrition log:', error);
    throw error;
  }
};