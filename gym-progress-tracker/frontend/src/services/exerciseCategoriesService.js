import api from "./api.js";

export const getExerciseCategories = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await api.get('/api/exercise-categories/');

        if (response) {
            return response.data
        }
    } catch (error) {
        console.error('Fehler beim Laden der Workouts:', error);
    }
};