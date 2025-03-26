import api from './api';

export const getWorkouts = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await api.get('/api/workout-templates/get');

    if (response) {
      return response.data
    }
  } catch (error) {
    console.error('Fehler beim Laden der Workouts:', error);
  }
};

export const addWorkout = async (workout) => {
  const token = localStorage.getItem('token');
  try {
    const response = api.get('/api/workout-templates/add', {
      body:
        JSON.stringify(workout)
    });
    return response.ok;
  } catch (error) {
    console.error('Fehler beim Hinzufügen des Workouts:', error);
    return false;
  }
}
