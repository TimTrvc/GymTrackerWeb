import api from './api';
import { handleError } from '@/utils/errorHandler';

/**
 * Basisklasse für alle Service-Module
 * Implementiert das Open/Closed-Prinzip aus SOLID
 */
class BaseService {
  /**
   * Konstruktor mit Basispfad für API-Endpunkte
   * @param {string} basePath - Der Basis-API-Pfad für diesen Service
   */
  constructor(basePath) {
    this.basePath = basePath;
    this.serviceName = this.constructor.name;
  }

  /**
   * Erstellt einen vollständigen Endpoint-Pfad
   * @param {string} path - Teilpfad, der an den Basispfad angehängt wird
   * @returns {string} - Vollständiger Pfad
   */
  endpoint(path = '') {
    return `${this.basePath}${path ? `/${path}` : ''}`;
  }

  /**
   * Standardisierte Fehlerbehandlung mit zentralem Error-Handler
   * @param {Error} error - Der aufgetretene Fehler
   * @param {string} defaultMessage - Standardnachricht falls keine Details im Fehler vorhanden
   * @throws {Error} Gibt einen Fehler mit sinnvoller Nachricht zurück
   */
  handleError(error, defaultMessage) {
    throw handleError(error, this.serviceName).error;
  }

  /**
   * GET-Anfrage an API
   * @param {string} path - Teilpfad für die Anfrage
   * @param {object} config - Axios-Konfiguration
   * @returns {Promise<any>} - Antwortdaten
   */
  async get(path = '', config = {}) {
    try {
      const response = await api.get(this.endpoint(path), config);
      return response.data;
    } catch (error) {
      this.handleError(error, `Fehler bei GET-Anfrage an ${this.endpoint(path)}`);
    }
  }

  /**
   * POST-Anfrage an API
   * @param {string} path - Teilpfad für die Anfrage
   * @param {object} data - Zu sendende Daten
   * @param {object} config - Axios-Konfiguration
   * @returns {Promise<any>} - Antwortdaten
   */
  async post(path = '', data = {}, config = {}) {
    try {
      const response = await api.post(this.endpoint(path), data, config);
      return response.data;
    } catch (error) {
      this.handleError(error, `Fehler bei POST-Anfrage an ${this.endpoint(path)}`);
    }
  }

  /**
   * PUT-Anfrage an API
   * @param {string} path - Teilpfad für die Anfrage
   * @param {object} data - Zu sendende Daten
   * @param {object} config - Axios-Konfiguration
   * @returns {Promise<any>} - Antwortdaten
   */
  async put(path = '', data = {}, config = {}) {
    try {
      const response = await api.put(this.endpoint(path), data, config);
      return response.data;
    } catch (error) {
      this.handleError(error, `Fehler bei PUT-Anfrage an ${this.endpoint(path)}`);
    }
  }

  /**
   * DELETE-Anfrage an API
   * @param {string} path - Teilpfad für die Anfrage
   * @param {object} config - Axios-Konfiguration
   * @returns {Promise<any>} - Antwortdaten
   */
  async delete(path = '', config = {}) {
    try {
      const response = await api.delete(this.endpoint(path), config);
      return response.data;
    } catch (error) {
      this.handleError(error, `Fehler bei DELETE-Anfrage an ${this.endpoint(path)}`);
    }
  }
}

export default BaseService;
