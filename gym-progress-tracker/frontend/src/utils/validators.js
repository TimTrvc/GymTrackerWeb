
/**
 * Central validation functions for all forms in the application.
 * Follows the DRY principle by avoiding duplicated validation logic.
 */

/**
 * Checks if a string contains a valid email address.
 * @param {string} email - The email address to validate.
 * @returns {boolean} True if the email is valid, false otherwise.
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Checks if a password meets security requirements.
 * @param {string} password - The password to validate.
 * @returns {boolean} True if the password is strong enough, false otherwise.
 */
export const isStrongPassword = (password) => {
  // At least 8 characters, one uppercase letter, one lowercase letter, one number
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return strongPasswordRegex.test(password);
};

/**
 * Checks if two passwords match.
 * @param {string} password - The main password.
 * @param {string} confirmPassword - The password confirmation.
 * @returns {boolean} True if the passwords match, false otherwise.
 */
export const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

/**
 * Checks if a username is valid.
 * @param {string} username - The username to validate.
 * @returns {boolean} True if the username is valid, false otherwise.
 */
export const isValidUsername = (username) => {
  // Only letters, numbers, underscores, min 3, max 20 characters
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

/**
 * Checks if a weight value is valid.
 * @param {number|string} weight - The weight value to validate.
 * @returns {boolean} True if the weight is valid, false otherwise.
 */
export const isValidWeight = (weight) => {
  const weightValue = parseFloat(weight);
  return !isNaN(weightValue) && weightValue > 0 && weightValue < 500;
};

/**
 * Checks if a value for repetitions is valid.
 * @param {number|string} reps - The repetitions value to validate.
 * @returns {boolean} True if the repetitions value is valid, false otherwise.
 */
export const isValidReps = (reps) => {
  const repsValue = parseInt(reps);
  return !isNaN(repsValue) && repsValue > 0 && repsValue <= 100;
};

/**
 * Checks if a text field is not empty.
 * @param {string} value - The value to check.
 * @returns {boolean} True if the value is not empty, false otherwise.
 */
export const isNotEmpty = (value) => {
  return typeof value === 'string' && value.trim().length > 0;
};

/**
 * Checks if a value is within a given range.
 * @param {number} value - The value to check.
 * @param {number} min - Minimum allowed value.
 * @param {number} max - Maximum allowed value.
 * @returns {boolean} True if the value is in range, false otherwise.
 */
export const isInRange = (value, min, max) => {
  const numValue = parseFloat(value);
  return !isNaN(numValue) && numValue >= min && numValue <= max;
};

/**
 * Validates a complete registration form.
 * @param {object} userData - The registration data to validate.
 * @returns {object} Validation result with errors and overall status.
 */
export const validateRegistration = (userData) => {
  const errors = {};
  
  // Validate username
  if (!isValidUsername(userData.username)) {
    errors.username = 'Username must be 3-20 characters and contain only letters, numbers, and underscores.';
  }
  // Validate email
  if (!isValidEmail(userData.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  // Validate password
  if (!isStrongPassword(userData.password)) {
    errors.password = 'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, and a number.';
  }
  // Validate password confirmation
  if (!passwordsMatch(userData.password, userData.confirmPassword)) {
    errors.confirmPassword = 'Passwords do not match.';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validates a login form.
 * @param {object} credentials - The login credentials to validate.
 * @returns {object} Validation result with errors and overall status.
 */
export const validateLogin = (credentials) => {
  const errors = {};
  
  if (!isNotEmpty(credentials.username)) {
    errors.username = 'Please enter your username.';
  }
  if (!isNotEmpty(credentials.password)) {
    errors.password = 'Please enter your password.';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validates a workout form.
 * @param {object} workoutData - The workout data to validate.
 * @returns {object} Validation result with errors and overall status.
 */
export const validateWorkout = (workoutData) => {
  const errors = {};
  
  if (!isNotEmpty(workoutData.name)) {
    errors.name = 'Please enter a name for the workout.';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export default {
  isValidEmail,
  isStrongPassword,
  passwordsMatch,
  isValidUsername,
  isValidWeight,
  isValidReps,
  isNotEmpty,
  isInRange,
  validateRegistration,
  validateLogin,
  validateWorkout
};
