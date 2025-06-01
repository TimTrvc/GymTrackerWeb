import api from './api';
import { handleError } from '@/utils/errorHandler';


/**
 * Base class for all service modules.
 * Implements the Open/Closed Principle from SOLID.
 */
class BaseService {
  /**
   * Constructs a service with a base API path.
   * @param {string} basePath - The base API path for this service.
   */
  constructor(basePath) {
    this.basePath = basePath;
    this.serviceName = this.constructor.name;
  }

  /**
   * Creates a full endpoint path.
   * @param {string} [path=''] - Subpath to append to the base path.
   * @returns {string} Full endpoint path.
   */
  endpoint(path = '') {
    return `${this.basePath}${path ? `/${path}` : ''}`;
  }

  /**
   * Standardized error handling with central error handler.
   * @param {Error} error - The error that occurred.
   * @param {string} defaultMessage - Default message if no details are present in the error.
   * @throws {Error} Throws an error with a meaningful message.
   */
  handleError(error, defaultMessage) {
    // Special case for 404 errors from exercise category endpoints
    if (error.response && error.response.status === 404 &&
        this.basePath === EXERCISE_ENDPOINTS.BASE &&
        error.config && error.config.url && error.config.url.includes('category')) {
      console.log('No exercises found in this category');
      return [];
    }
    throw handleError(error, this.serviceName).error;
  }

  /**
   * Sends a GET request to the API.
   * @param {string} [path=''] - Subpath for the request.
   * @param {object} [config={}] - Axios configuration.
   * @returns {Promise<any>} Response data.
   */
  async get(path = '', config = {}) {
    try {
      const response = await api.get(this.endpoint(path), config);
      return response.data;
    } catch (error) {
      // Pass the error to the caller instead of handling it here
      // This allows specialized handling in the services or hooks
      if (error.response && error.response.status === 404) {
        // For 404 errors, just return an empty array
        console.log(`No data found for ${this.endpoint(path)}`);
        return [];
      }
      this.handleError(error, `Error on GET request to ${this.endpoint(path)}`);
    }
  }

  /**
   * Sends a POST request to the API.
   * @param {string} [path=''] - Subpath for the request.
   * @param {object} [data={}] - Data to send.
   * @param {object} [config={}] - Axios configuration.
   * @returns {Promise<any>} Response data.
   */
  async post(path = '', data = {}, config = {}) {
    try {
      const response = await api.post(this.endpoint(path), data, config);
      return response.data;
    } catch (error) {
      this.handleError(error, `Error on POST request to ${this.endpoint(path)}`);
    }
  }

  /**
   * Sends a PUT request to the API.
   * @param {string} [path=''] - Subpath for the request.
   * @param {object} [data={}] - Data to send.
   * @param {object} [config={}] - Axios configuration.
   * @returns {Promise<any>} Response data.
   */
  async put(path = '', data = {}, config = {}) {
    try {
      const response = await api.put(this.endpoint(path), data, config);
      return response.data;
    } catch (error) {
      this.handleError(error, `Error on PUT request to ${this.endpoint(path)}`);
    }
  }

  /**
   * Sends a DELETE request to the API.
   * @param {string} [path=''] - Subpath for the request.
   * @param {object} [config={}] - Axios configuration.
   * @returns {Promise<any>} Response data.
   */
  async delete(path = '', config = {}) {
    try {
      const response = await api.delete(this.endpoint(path), config);
      return response.data;
    } catch (error) {
      this.handleError(error, `Error on DELETE request to ${this.endpoint(path)}`);
    }
  }
}

export default BaseService;
