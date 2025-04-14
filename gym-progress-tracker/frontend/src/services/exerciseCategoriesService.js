import BaseService from './BaseService';import { EXERCISE_ENDPOINTS } from '@/config/apiEndpoints';/** * Service für die Verwaltung von Übungskategorien * Verwendet zentrale API-Endpunkte (DRY-Prinzip) */class ExerciseCategoriesService extends BaseService {  /**   * Konstruktor für den ExerciseCategories Service   */  constructor() {    super(EXERCISE_ENDPOINTS.CATEGORIES);  }

  /**
   * Holt alle Übungskategorien
   * @returns {Promise<Array>} - Liste von Übungskategorien
   */
  async getExerciseCategories() {
    try {
      return await this.get();
    } catch (error) {
      this.handleError(error, 'Fehler beim Laden der Übungskategorien');
    }
  }
}

// Singleton-Instanz des Services exportieren
const exerciseCategoriesService = new ExerciseCategoriesService();
export default exerciseCategoriesService;

// Kompatibilitätsexporte für bisherige direkte Funktionsaufrufe
export const getExerciseCategories = () => exerciseCategoriesService.getExerciseCategories();
