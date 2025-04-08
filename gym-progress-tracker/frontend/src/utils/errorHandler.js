/**
 * Zentrale Fehlerbehandlung und Fehlertypen
 * Folgt dem Single Responsibility Principle und DRY
 */

// Standard-Fehlermeldungen für häufige Anwendungsfälle
export const ERROR_MESSAGES = {
  NETWORK: 'Netzwerkfehler: Bitte überprüfen Sie Ihre Internetverbindung.',
  UNAUTHORIZED: 'Nicht autorisiert: Bitte melden Sie sich erneut an.',
  NOT_FOUND: 'Die angeforderte Ressource wurde nicht gefunden.',
  SERVER: 'Ein Serverfehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
  VALIDATION: 'Bitte überprüfen Sie Ihre Eingaben.',
  DEFAULT: 'Ein unerwarteter Fehler ist aufgetreten.'
};

/**
 * Analysiert einen Fehler und gibt eine benutzerfreundliche Fehlermeldung zurück
 * @param {Error|Object} error - Der aufgetretene Fehler
 * @param {string} defaultMessage - Optionale Standardnachricht
 * @returns {string} Benutzerfreundliche Fehlermeldung
 */
export const getErrorMessage = (error, defaultMessage = ERROR_MESSAGES.DEFAULT) => {
  // Wenn kein Fehler vorhanden ist, Standardmeldung zurückgeben
  if (!error) return defaultMessage;

  // Wenn der Fehler ein axios-Fehler ist
  if (error.response) {
    const { status } = error.response;
    
    // Statuscode-basierte Fehlermeldungen
    switch (status) {
      case 401:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case 404:
        return ERROR_MESSAGES.NOT_FOUND;
      case 422:
        return ERROR_MESSAGES.VALIDATION;
      case 500:
        return ERROR_MESSAGES.SERVER;
      default:
        // Wenn der Server eine spezifische Fehlermeldung sendet, diese verwenden
        return error.response.data?.error || defaultMessage;
    }
  }
  
  // Netzwerkfehler
  if (error.request && !error.response) {
    return ERROR_MESSAGES.NETWORK;
  }
  
  // Wenn der Fehler eine einfache Nachricht oder ein String ist
  if (error.message || typeof error === 'string') {
    return error.message || error;
  }
  
  return defaultMessage;
};

/**
 * Protokolliert Fehler für Debugging-Zwecke
 * @param {Error|Object} error - Der zu protokollierende Fehler
 * @param {string} context - Der Kontext, in dem der Fehler aufgetreten ist
 */
export const logError = (error, context = 'Anwendung') => {
  // In Produktionsumgebung Fehler an einen Logging-Service senden
  if (import.meta.env.PROD) {
    // Hier könnte ein externer Logging-Dienst eingebunden werden
    console.error(`[${context}] Fehler:`, error);
  } else {
    // In Entwicklungsumgebung detaillierte Fehlerinformationen anzeigen
    console.group(`[${context}] Fehler:`);
    console.error(error);
    if (error.response) {
      console.log('Server-Antwort:', error.response.data);
      console.log('Status:', error.response.status);
    }
    console.groupEnd();
  }
};

/**
 * Behandelt einen Fehler und gibt eine strukturierte Antwort zurück
 * @param {Error|Object} error - Der zu behandelnde Fehler
 * @param {string} context - Der Kontext, in dem der Fehler aufgetreten ist
 * @returns {Object} Strukturierte Fehlerantwort
 */
export const handleError = (error, context = 'Anwendung') => {
  const message = getErrorMessage(error);
  logError(error, context);
  
  return {
    success: false,
    message,
    error
  };
};

export default {
  ERROR_MESSAGES,
  getErrorMessage,
  logError,
  handleError
};
