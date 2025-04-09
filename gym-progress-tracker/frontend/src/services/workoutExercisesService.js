import BaseService from './BaseService';
import { WORKOUT_ENDPOINTS } from '@/config/apiEndpoints';

/**
 * Service für die Verwaltung von Workout-Übungen
 * Ermöglicht das Hinzufügen und Verwalten von Übungen zu einem Workout
 */
class WorkoutExercisesService extends BaseService {
  constructor() {
    super(WORKOUT_ENDPOINTS.EXERCISES);
  }

  /**
   * Holt alle Übungen eines Workouts
   * @param {string|number} workoutId - ID des Workouts
   * @returns {Promise<Array>} - Liste von Übungen im Workout
   */
  async getWorkoutExercises(workoutId) {
    return this.get(`/${workoutId}`);
  }

  /**
   * Fügt eine Übung zu einem Workout hinzu
   * @param {object} exerciseData - Übungsdaten mit workout_id, exercise_id, position, sets, reps, rest_seconds
   * @returns {Promise<Object>} - Hinzugefügte Übung
   */
  async addExerciseToWorkout(exerciseData) {
    return this.post('/', exerciseData);
  }

  /**
   * Löscht eine Übung aus einem Workout
   * @param {string|number} workoutExerciseId - ID der Workout-Übung
   * @returns {Promise<Object>} - Bestätigungsnachricht
   */
  async removeExerciseFromWorkout(workoutExerciseId) {
    return this.delete(`/${workoutExerciseId}`);
  }
}

// Singleton-Instanz des Services exportieren
const workoutExercisesService = new WorkoutExercisesService();
export default workoutExercisesService;

// Kompatibilitätsexporte für einfachen Zugriff
export const getWorkoutExercises = (workoutId) => workoutExercisesService.getWorkoutExercises(workoutId);
export const addExerciseToWorkout = (exerciseData) => workoutExercisesService.addExerciseToWorkout(exerciseData);
export const removeExerciseFromWorkout = (workoutExerciseId) => workoutExercisesService.removeExerciseFromWorkout(workoutExerciseId);
