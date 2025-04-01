import api from "./api.js";

export const getExerciseByCategory = async (category_id) => {
  try {
    const response = await api.get('/api/exercises/category/' + category_id);

    if (response) {
      return response.data
    }
  } catch (error) {
    console.error('Fehler beim Laden der Workouts:', error);
  }
};

export const getExerciseById = async (exercise_id) => {
  try {
    const response = await api.get('/api/exercises/' + exercise_id);

    if (response) {
      return response.data
    }
  } catch (error) {
    console.error('Error getting exercises ' + e)
  }
}

export const createExercise = async (exerciseData) => {
  try {
    const response = await api.post('/api/exercises', exerciseData);
    return response.data;
  } catch (error) {
    console.error('Error creating exercise:', error);
    throw error;
  }
};
