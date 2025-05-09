import BaseService from './BaseService';import { STATS_ENDPOINTS } from '@/config/apiEndpoints';/** * Service für die Verwaltung von Körpermaßen * Verwendet zentrale API-Endpunkte (DRY-Prinzip) */class BodyMeasurementsService extends BaseService {  /**   * Konstruktor für den BodyMeasurements Service   */  constructor() {    super(STATS_ENDPOINTS.BODY);  }  /**   * Holt alle Körpermaße   * @returns {Promise<Array>} - Liste von Körpermaßen   */  async getBodyMeasurements() {    try {
      return await this.get();
    } catch (error) {
      this.handleError(error, 'Fehler beim Abrufen der Körpermaße');
    }
  }

  /**
   * Fügt ein neues Körpermaß hinzu
   * @param {object} measurementData - Daten des Körpermaßes
   * @returns {Promise<Object>} - Hinzugefügtes Körpermaß
   */
  async addBodyMeasurement(measurementData) {
    try {
      return await this.post('', measurementData);
    } catch (error) {
      this.handleError(error, 'Fehler beim Hinzufügen des Körpermaßes');
    }
  }
 /**
   * Löscht ein Körpermaß
   * @param {string|number} measurementId - ID des zu löschenden Körpermaßes
   * @returns {Promise<Object>} - Ergebnis des Löschvorgangs
   */
 async deleteBodyMeasurement(measurementId) {
  try {
    return await this.delete(`/${measurementId}`);
  } catch (error) {
    this.handleError(error, 'Fehler beim Löschen des Körpermaßes');
  }
}
}

// Singleton-Instanz des Services exportieren
const bodyMeasurementsService = new BodyMeasurementsService();
export default bodyMeasurementsService;

// Kompatibilitätsexporte für bisherige direkte Funktionsaufrufe
export const getBodyMeasurements = () => bodyMeasurementsService.getBodyMeasurements();
export const addBodyMeasurement = (measurementData) => bodyMeasurementsService.addBodyMeasurement(measurementData);
export const deleteBodyMeasurement = (measurementId) => bodyMeasurementsService.deleteBodyMeasurement(measurementId);