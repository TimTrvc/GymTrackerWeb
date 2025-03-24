import api from './api';

export const fetchProgressData = async () => {
  try {
    const response = await api.get('/api/progress');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Fehler beim Laden der Fortschrittsdaten');
  }
};

export const addProgressData = async (progressData) => {
  try {
    const response = await api.post('/api/progress', progressData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Fehler beim Hinzufügen des Fortschritts');
  }
};
