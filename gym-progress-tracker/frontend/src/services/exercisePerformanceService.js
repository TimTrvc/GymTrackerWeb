import BaseService from './BaseService';
import { EXERCISE_ENDPOINTS } from '@/config/apiEndpoints';

/**
 * Service für die Verwaltung von Übungsleistungen (exercise performances)
 */
class ExercisePerformanceService extends BaseService {
  constructor() {
    super(EXERCISE_ENDPOINTS.PERFORMANCE);
  }

  /**
   * Fügt eine Übungsleistung hinzu (ein Satz)
   * @param {object} performanceData - Daten für die Übungsleistung
   * @returns {Promise<Object>} - Hinzugefügte Leistung
   */
  async addPerformance(performanceData) {
    return this.post('', performanceData);
  }
}

const exercisePerformanceService = new ExercisePerformanceService();
export default exercisePerformanceService;
export const addExercisePerformance = (performanceData) => exercisePerformanceService.addPerformance(performanceData);

/**
 * Holt alle Übungsleistungen einer Session
 * @param {string|number} sessionId
 * @returns {Promise<Array>} - Liste der Leistungen
 */
export const getExercisePerformances = (sessionId) => exercisePerformanceService.get(`/${sessionId}`);
