import BaseService from './BaseService';
import { STATS_ENDPOINTS } from '@/config/apiEndpoints';

/**
 * Service für die Verwaltung von Trainingssessions
 */
class TrainingSessionsService extends BaseService {
  constructor() {
    super(STATS_ENDPOINTS.SESSIONS);
  }

  /**
   * Fügt eine Trainingssession hinzu
   * @param {object} sessionData - Daten für die Trainingssession
   * @returns {Promise<Object>} - Hinzugefügte Session
   */
  async addSession(sessionData) {
    return this.post('', sessionData);
  }
}

const trainingSessionsService = new TrainingSessionsService();
export default trainingSessionsService;
export const addTrainingSession = (sessionData) => trainingSessionsService.addSession(sessionData);
