import BaseService from './BaseService';
import { EXERCISE_ENDPOINTS } from '@/config/apiEndpoints';

/**
 * Service for managing exercise performances (sets and results).
 * @class ExercisePerformanceService
 * @extends BaseService
 */
class ExercisePerformanceService extends BaseService {
  constructor() {
    super(EXERCISE_ENDPOINTS.PERFORMANCE);
  }

  /**
   * Adds an exercise performance (a set).
   * @param {object} performanceData - Data for the exercise performance.
   * @returns {Promise<Object>} The added performance.
   */
  async addPerformance(performanceData) {
    return this.post('', performanceData);
  }
}


// Export singleton instance
const exercisePerformanceService = new ExercisePerformanceService();
export default exercisePerformanceService;

/**
 * Adds an exercise performance (compatibility export).
 * @param {object} performanceData
 * @returns {Promise<Object>}
 */
export const addExercisePerformance = (performanceData) => exercisePerformanceService.addPerformance(performanceData);

/**
 * Gets all exercise performances for a session.
 * @param {string|number} sessionId - The session ID.
 * @returns {Promise<Array>} List of performances.
 */
export const getExercisePerformances = (sessionId) => exercisePerformanceService.get(`/${sessionId}`);
