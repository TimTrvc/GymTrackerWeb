import BaseService from './BaseService';
import { EXERCISE_ENDPOINTS } from '@/config/apiEndpoints';


/**
 * Service for managing exercises.
 * Uses central API endpoints (DRY principle).
 * @class ExercisesService
 * @extends BaseService
 */
class ExercisesService extends BaseService {
  constructor() {
    super(EXERCISE_ENDPOINTS.BASE);
  }

  /**
   * Gets exercises by category.
   * @param {number|string} categoryIdentifier - ID or name of the category.
   * @returns {Promise<Array>} List of exercises.
   * @throws {Error} If the category ID is not numeric.
   */
  async getByCategory(categoryIdentifier) {
    // Ensure we always use a numeric ID
    let categoryParam;
    if (typeof categoryIdentifier === 'string') {
      // Try to convert the string to a number
      if (!isNaN(parseInt(categoryIdentifier))) {
        categoryParam = parseInt(categoryIdentifier);
      } else {
        // If it's a category name, log and throw an error
        console.error("Category ID must be numeric, received:", categoryIdentifier);
        throw new Error("Category ID must be numeric");
      }
    } else {
      // If it's already a number, use it directly
      categoryParam = categoryIdentifier;
    }
    return this.get(`category/${categoryParam}`);
  }

  /**
   * Gets a specific exercise by ID.
   * @param {number} exerciseId - ID of the exercise.
   * @returns {Promise<Object>} Exercise details.
   * @throws {Error} If the exercise ID is invalid.
   */
  async getById(exerciseId) {
    console.log("Fetching exercise by ID:", exerciseId);
    if (!exerciseId) {
      throw new Error("Invalid exercise ID provided");
    }
    try {
      const result = await this.get(`${exerciseId}`);
      console.log("Fetch result:", result);
      return result;
    } catch (error) {
      console.error("Error in getById:", error);
      throw error;
    }
  }

  /**
   * Creates a new exercise.
   * @param {object} exerciseData - Data for the new exercise.
   * @returns {Promise<Object>} Created exercise.
   */
  async create(exerciseData) {
    return this.post('', exerciseData);
  }
}

// Export singleton instance of the service
const exercisesService = new ExercisesService();
export default exercisesService;

/**
 * Gets exercises by category (compatibility export).
 * @param {number|string} categoryId
 * @returns {Promise<Array>}
 */
export const getExerciseByCategory = (categoryId) => exercisesService.getByCategory(categoryId);

/**
 * Gets an exercise by its ID (compatibility export).
 * @param {number} exerciseId
 * @returns {Promise<Object>}
 */
export const getExerciseById = (exerciseId) => exercisesService.getById(exerciseId);

/**
 * Creates a new exercise (compatibility export).
 * @param {object} exerciseData
 * @returns {Promise<Object>}
 */
export const createExercise = (exerciseData) => exercisesService.create(exerciseData);
