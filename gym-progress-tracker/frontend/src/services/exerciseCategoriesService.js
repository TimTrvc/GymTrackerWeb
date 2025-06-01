import BaseService from './BaseService';
import { EXERCISE_ENDPOINTS } from '@/config/apiEndpoints';

/**
 * Service for managing exercise categories.
 * Uses central API endpoints (DRY principle).
 * @class ExerciseCategoriesService
 * @extends BaseService
 */
class ExerciseCategoriesService extends BaseService {
  /**
   * Constructor for the ExerciseCategoriesService.
   */
  constructor() {
    super(EXERCISE_ENDPOINTS.CATEGORIES);
  }

  /**
   * Gets all exercise categories.
   * @returns {Promise<Array>} List of exercise categories.
   */
  async getExerciseCategories() {
    try {
      return await this.get();
    } catch (error) {
      this.handleError(error, 'Error loading exercise categories');
    }
  }
}

// Export singleton instance of the service
const exerciseCategoriesService = new ExerciseCategoriesService();
export default exerciseCategoriesService;

/**
 * Gets all exercise categories (compatibility export).
 * @returns {Promise<Array>}
 */
export const getExerciseCategories = () => exerciseCategoriesService.getExerciseCategories();
