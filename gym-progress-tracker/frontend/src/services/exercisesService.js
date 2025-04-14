import BaseService from './BaseService';
import { EXERCISE_ENDPOINTS } from '@/config/apiEndpoints';

/**
 * Service für die Verwaltung von Übungen
 * Verwendet zentrale API-Endpunkte (DRY-Prinzip)
 */
class ExercisesService extends BaseService {
  constructor() {
    super(EXERCISE_ENDPOINTS.BASE);
  }  /**
   * Holt Übungen nach Kategorie
   * @param {number|string} categoryIdentifier - ID oder Name der Kategorie
   * @returns {Promise<Array>} - Liste von Übungen
   */
  async getByCategory(categoryIdentifier) {
    // Stelle sicher, dass wir immer eine numerische ID verwenden
    let categoryParam;
    
    if (typeof categoryIdentifier === 'string') {
      // Versuchen, den String in eine Zahl umzuwandeln
      if (!isNaN(parseInt(categoryIdentifier))) {
        categoryParam = parseInt(categoryIdentifier);
      } else {
        // Wenn es sich um einen Kategorienamen handelt, loggen und einen Fehler werfen
        console.error("Kategorie-ID muss numerisch sein, erhielt:", categoryIdentifier);
        throw new Error("Kategorie-ID muss numerisch sein");
      }
    } else {
      // Wenn es bereits eine Zahl ist, verwenden wir sie direkt
      categoryParam = categoryIdentifier;
    }
    
    return this.get(`category/${categoryParam}`);
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
