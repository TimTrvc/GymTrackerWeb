import BaseService from './BaseService';
import { WORKOUT_ENDPOINTS } from '@/config/apiEndpoints';


/**
 * Service for managing workouts.
 * Uses central API endpoints (DRY principle).
 * @class WorkoutService
 * @extends BaseService
 */
class WorkoutService extends BaseService {
  constructor() {
    super(WORKOUT_ENDPOINTS.WORKOUTS);
  }

  /**
   * Gets all workouts.
   * @returns {Promise<Array>} List of workouts.
   */
  async getAllWorkouts() {
    return this.get('/');
  }

  /**
   * Adds a new workout.
   * @param {object} workoutData - Workout data.
   * @returns {Promise<Object>} Added workout.
   */
  async addWorkout(workoutData) {
    return this.post('/', workoutData);
  }

  /**
   * Updates an existing workout.
   * @param {string|number} workoutId - ID of the workout to update.
   * @param {object} workoutData - Updated workout data.
   * @returns {Promise<Object>} Updated workout.
   */
  async updateWorkout(workoutId, workoutData) {
    return this.put(`/${workoutId}`, workoutData);
  }

  /**
   * Deletes a workout.
   * @param {string|number} workoutId - ID of the workout to delete.
   * @returns {Promise<Object>} Confirmation message.
   */
  async deleteWorkout(workoutId) {
    return this.delete(`/${workoutId}`);
  }
}

// Export singleton instance of the service
const workoutService = new WorkoutService();
export default workoutService;

// Compatibility exports for legacy support
export const getWorkouts = () => workoutService.getAllWorkouts();
export const addWorkout = (workoutData) => workoutService.addWorkout(workoutData);
