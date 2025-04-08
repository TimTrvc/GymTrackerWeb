import api from "./api.js";

export const getBodyMeasurements = async () => {
  try {
    const response = await api.get('/api/body-measurements');
    return response.data;
  } catch (error) {
    console.error('Error fetching body measurements:', error);
    throw error;
  }
};

export const addBodyMeasurement = async (measurementData) => {
  try {
    const response = await api.post('/api/body-measurements', measurementData);
    return response.data;
  } catch (error) {
    console.error('Error adding body measurement:', error);
    throw error;
  }
};