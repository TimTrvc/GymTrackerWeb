import BaseService from './BaseService';
import { WORKOUT_ENDPOINTS } from '@/config/apiEndpoints';


/**
 * Service for managing workout exercises.
 * Allows adding and managing exercises in a workout.
 * @class WorkoutExercisesService
 * @extends BaseService
 */
class WorkoutExercisesService extends BaseService {
  constructor() {
    super(WORKOUT_ENDPOINTS.EXERCISES);
  }

  /**
   * Gets all exercises for a workout.
   * @param {string|number} workoutId - ID of the workout.
   * @returns {Promise<Array>} List of exercises in the workout.
   */
  async getWorkoutExercises(workoutId) {
    return this.get(`/${workoutId}`);
  }

  /**
   * Adds an exercise to a workout.
   * @param {object} exerciseData - Exercise data with workout_id, exercise_id, position, sets, reps, rest_seconds.
   * @returns {Promise<Object>} Added exercise.
   */
  async addExerciseToWorkout(exerciseData) {
    return this.post('/', exerciseData);
  }

  /**
   * Removes an exercise from a workout.
   * @param {string|number} workoutExerciseId - ID of the workout exercise.
   * @returns {Promise<Object>} Confirmation message.
   */
  async removeExerciseFromWorkout(workoutExerciseId) {
    return this.delete(`/${workoutExerciseId}`);
  }
}

// Export singleton instance of the service
const workoutExercisesService = new WorkoutExercisesService();
export default workoutExercisesService;

// Compatibility exports for easy access
export const getWorkoutExercises = (workoutId) => workoutExercisesService.getWorkoutExercises(workoutId);
export const addExerciseToWorkout = (exerciseData) => workoutExercisesService.addExerciseToWorkout(exerciseData);
export const removeExerciseFromWorkout = (workoutExerciseId) => workoutExercisesService.removeExerciseFromWorkout(workoutExerciseId);
