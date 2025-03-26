import api from './api';

export const getWorkouts = async () => {
  try {
    const response = await api.get('/api/workouts/get');

    if (response) {
      return response.data
    }
  } catch (error) {
    console.error('Fehler beim Laden der Workouts:', error);
  }
};

export const addWorkout = async (workout) => {
  try {
    const response = api.get('/api/workouts/add', {
      body:
        JSON.stringify(workout)
    });
    return response.ok;
  } catch (error) {
    console.error('Fehler beim Hinzufügen des Workouts:', error);
    return false;
  }
}
