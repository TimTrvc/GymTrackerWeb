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
