import BaseService from './BaseService';
import { WORKOUT_ENDPOINTS } from '@/config/apiEndpoints';

/**
 * Service für die Verwaltung von Workout-Templates
 * Verwendet zentrale API-Endpunkte (DRY-Prinzip)
 */
class WorkoutService extends BaseService {
  constructor() {
    super(WORKOUT_ENDPOINTS.TEMPLATES);
  }

  /**
   * Holt alle Workout-Templates
   * @returns {Promise<Array>} - Liste von Workout-Templates
   */
  async getAllWorkouts() {
    return this.get('get');
  }

  /**
   * Fügt ein neues Workout-Template hinzu
   * @param {object} workoutData - Workout-Daten
   * @returns {Promise<Object>} - Hinzugefügtes Workout
   */
  async addWorkout(workoutData) {
    return this.post('add', workoutData);
  }
}

// Singleton-Instanz des Services exportieren
const workoutService = new WorkoutService();
export default workoutService;

// Kompatibilitätsexporte für alte Methoden (Legacy-Unterstützung)
export const getWorkouts = () => workoutService.getAllWorkouts();
export const addWorkout = (workoutData) => workoutService.addWorkout(workoutData);
