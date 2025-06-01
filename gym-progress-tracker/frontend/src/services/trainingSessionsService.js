import BaseService from './BaseService';
import { STATS_ENDPOINTS } from '@/config/apiEndpoints';


/**
 * Service for managing training sessions.
 * @class TrainingSessionsService
 * @extends BaseService
 */
class TrainingSessionsService extends BaseService {
  constructor() {
    super(STATS_ENDPOINTS.SESSIONS);
  }

  /**
   * Gets all training sessions for the user.
   * @returns {Promise<Array>} List of sessions.
   */
  async getAllSessions() {
    return this.get('/');
  }

  /**
   * Adds a training session.
   * @param {object} sessionData - Data for the training session.
   * @returns {Promise<Object>} Added session.
   */
  async addSession(sessionData) {
    return this.post('', sessionData);
  }
}

// Export singleton instance of the service
const trainingSessionsService = new TrainingSessionsService();
export default trainingSessionsService;

/**
 * Adds a training session (compatibility export).
 * @param {object} sessionData
 * @returns {Promise<Object>}
 */
export const addTrainingSession = (sessionData) => trainingSessionsService.addSession(sessionData);

/**
 * Gets all training sessions (compatibility export).
 * @returns {Promise<Array>}
 */
export const getTrainingSessions = () => trainingSessionsService.getAllSessions();
