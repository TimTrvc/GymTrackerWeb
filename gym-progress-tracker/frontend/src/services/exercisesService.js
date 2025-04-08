import BaseService from './BaseService';
import { EXERCISE_ENDPOINTS } from '@/config/apiEndpoints';

/**
 * Service für die Verwaltung von Übungen
 * Verwendet zentrale API-Endpunkte (DRY-Prinzip)
 */
class ExercisesService extends BaseService {
  constructor() {
    super(EXERCISE_ENDPOINTS.BASE);
  }

  /**
   * Holt Übungen nach Kategorie
   * @param {number} categoryId - ID der Kategorie
   * @returns {Promise<Array>} - Liste von Übungen
   */
  async getByCategory(categoryId) {
    return this.get(`category/${categoryId}`);
  }

  /**
   * Holt eine spezifische Übung nach ID
   * @param {number} exerciseId - ID der Übung
   * @returns {Promise<Object>} - Übungsdetails
   */
  async getById(exerciseId) {
    return this.get(`${exerciseId}`);
  }

  /**
   * Erstellt eine neue Übung
   * @param {object} exerciseData - Daten der neuen Übung
   * @returns {Promise<Object>} - Erstellte Übung
   */
  async create(exerciseData) {
    return this.post('', exerciseData);
  }
}

// Singleton-Instanz des Services exportieren
const exercisesService = new ExercisesService();
export default exercisesService;

// Kompatibilitätsexporte für alte Methoden (Legacy-Unterstützung)
export const getExerciseByCategory = (categoryId) => exercisesService.getByCategory(categoryId);
export const getExerciseById = (exerciseId) => exercisesService.getById(exerciseId);
export const createExercise = (exerciseData) => exercisesService.create(exerciseData);
