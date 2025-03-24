import api from './api';

export const fetchWorkouts = async () => {
  try {
    const response = await api.get('/api/workouts/get');
    return response.data.workouts.rows;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Fehler beim Laden der Workouts');
  }
};

export const addWorkout = async (workoutData) => {
  try {
    const response = await api.post('/api/workouts/add', workoutData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Fehler beim Hinzufügen des Workouts');
  }
};

export const updateWorkout = async (workoutId, workoutData) => {
  try {
    const response = await api.put(`/api/workouts/${workoutId}`, workoutData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Fehler beim Aktualisieren des Workouts');
  }
};

export const deleteWorkout = async (workoutId) => {
  try {
    const response = await api.delete(`/api/workouts/${workoutId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Fehler beim Löschen des Workouts');
  }
};
