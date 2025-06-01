import BaseService from './BaseService';
import { STATS_ENDPOINTS } from '@/config/apiEndpoints';

/**
 * Service for managing body measurements.
 * Uses central API endpoints (DRY principle).
 * @class BodyMeasurementsService
 * @extends BaseService
 */
class BodyMeasurementsService extends BaseService {
  /**
   * Constructor for the BodyMeasurementsService.
   */
  constructor() {
    super(STATS_ENDPOINTS.BODY);
  }

  /**
   * Gets all body measurements.
   * @returns {Promise<Array>} List of body measurements.
   */
  async getBodyMeasurements() {
    try {
      return await this.get();
    } catch (error) {
      this.handleError(error, 'Error fetching body measurements');
    }
  }

  /**
   * Adds a new body measurement.
   * @param {object} measurementData - Data for the body measurement.
   * @returns {Promise<Object>} The added body measurement.
   */
  async addBodyMeasurement(measurementData) {
    try {
      return await this.post('', measurementData);
    } catch (error) {
      this.handleError(error, 'Error adding body measurement');
    }
  }

  /**
   * Deletes a body measurement.
   * @param {string|number} measurementId - ID of the measurement to delete.
   * @returns {Promise<Object>} Result of the delete operation.
   */
  async deleteBodyMeasurement(measurementId) {
    try {
      return await this.delete(`/${measurementId}`);
    } catch (error) {
      this.handleError(error, 'Error deleting body measurement');
    }
  }
}

// Export singleton instance of the service
const bodyMeasurementsService = new BodyMeasurementsService();
export default bodyMeasurementsService;

/**
 * Gets all body measurements (compatibility export).
 * @returns {Promise<Array>}
 */
export const getBodyMeasurements = () => bodyMeasurementsService.getBodyMeasurements();

/**
 * Adds a new body measurement (compatibility export).
 * @param {object} measurementData
 * @returns {Promise<Object>}
 */
export const addBodyMeasurement = (measurementData) => bodyMeasurementsService.addBodyMeasurement(measurementData);

/**
 * Deletes a body measurement (compatibility export).
 * @param {string|number} measurementId
 * @returns {Promise<Object>}
 */
export const deleteBodyMeasurement = (measurementId) => bodyMeasurementsService.deleteBodyMeasurement(measurementId);