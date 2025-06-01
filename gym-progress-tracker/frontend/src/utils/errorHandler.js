
/**
 * Central error handling and error types.
 * Follows the Single Responsibility Principle and DRY.
 */


/**
 * Standard error messages for common application cases.
 */
export const ERROR_MESSAGES = {
  NETWORK: 'Network error: Please check your internet connection.',
  UNAUTHORIZED: 'Unauthorized: Please log in again.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER: 'A server error occurred. Please try again later.',
  VALIDATION: 'Please check your input.',
  DEFAULT: 'An unexpected error occurred.'
};

/**
 * Analyzes an error and returns a user-friendly error message.
 * @param {Error|Object} error - The error that occurred.
 * @param {string} [defaultMessage=ERROR_MESSAGES.DEFAULT] - Optional default message.
 * @returns {string} User-friendly error message.
 */
export const getErrorMessage = (error, defaultMessage = ERROR_MESSAGES.DEFAULT) => {
  // If no error is present, return the default message
  if (!error) return defaultMessage;

  // If the error is an axios error
  if (error.response) {
    const { status } = error.response;
    // Status code-based error messages
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
        // Use specific error message from server if available
        return error.response.data?.error || defaultMessage;
    }
  }
  // Network error
  if (error.request && !error.response) {
    return ERROR_MESSAGES.NETWORK;
  }
  // If the error is a simple message or string
  if (error.message || typeof error === 'string') {
    return error.message || error;
  }
  return defaultMessage;
};

/**
 * Logs errors for debugging purposes.
 * @param {Error|Object} error - The error to log.
 * @param {string} [context='Application'] - The context in which the error occurred.
 */
export const logError = (error, context = 'Application') => {
  // In production, send errors to a logging service
  if (import.meta.env.PROD) {
    // Here you could integrate an external logging service
    console.error(`[${context}] Error:`, error);
  } else {
    // In development, show detailed error information
    console.group(`[${context}] Error:`);
    console.error(error);
    if (error.response) {
      console.log('Server response:', error.response.data);
      console.log('Status:', error.response.status);
    }
    console.groupEnd();
  }
};

/**
 * Handles an error and returns a structured response.
 * @param {Error|Object} error - The error to handle.
 * @param {string} [context='Application'] - The context in which the error occurred.
 * @returns {Object} Structured error response.
 */
export const handleError = (error, context = 'Application') => {
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
