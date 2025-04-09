import BaseService from './BaseService';
import { WORKOUT_ENDPOINTS } from '@/config/apiEndpoints';

/**
 * Service für die Verwaltung von Workouts
 * Verwendet zentrale API-Endpunkte (DRY-Prinzip)
 */
class WorkoutService extends BaseService {
  constructor() {
    super(WORKOUT_ENDPOINTS.WORKOUTS);
  }

  /**
   * Holt alle Workouts
   * @returns {Promise<Array>} - Liste von Workouts
   */
  async getAllWorkouts() {
    return this.get('/');
  }

  /**
   * Fügt ein neues Workout hinzu
   * @param {object} workoutData - Workout-Daten
   * @returns {Promise<Object>} - Hinzugefügtes Workout
   */
  async addWorkout(workoutData) {
    return this.post('/', workoutData);
  }

  /**
   * Aktualisiert ein bestehendes Workout
   * @param {string|number} workoutId - ID des zu aktualisierenden Workouts
   * @param {object} workoutData - Aktualisierte Workout-Daten
   * @returns {Promise<Object>} - Aktualisiertes Workout
   */
  async updateWorkout(workoutId, workoutData) {
    return this.put(`/${workoutId}`, workoutData);
  }

  /**
   * Löscht ein Workout
   * @param {string|number} workoutId - ID des zu löschenden Workouts
   * @returns {Promise<Object>} - Bestätigungsnachricht
   */
  async deleteWorkout(workoutId) {
    return this.delete(`/${workoutId}`);
  }
}

// Singleton-Instanz des Services exportieren
const workoutService = new WorkoutService();
export default workoutService;

// Kompatibilitätsexporte für alte Methoden (Legacy-Unterstützung)
export const getWorkouts = () => workoutService.getAllWorkouts();
export const addWorkout = (workoutData) => workoutService.addWorkout(workoutData);
