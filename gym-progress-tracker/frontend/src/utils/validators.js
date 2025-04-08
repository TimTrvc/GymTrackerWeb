/**
 * Zentrale Validierungsfunktionen für alle Formulare in der Anwendung
 * Folgt dem DRY-Prinzip durch Vermeidung duplizierter Validierungslogik
 */

/**
 * Überprüft, ob ein String eine valide E-Mail enthält
 * @param {string} email - Die zu prüfende E-Mail-Adresse
 * @returns {boolean} Ist die E-Mail gültig?
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Überprüft, ob ein Passwort den Sicherheitsanforderungen entspricht
 * @param {string} password - Das zu prüfende Passwort
 * @returns {boolean} Ist das Passwort sicher genug?
 */
export const isStrongPassword = (password) => {
  // Mindestens 8 Zeichen, ein Großbuchstabe, ein Kleinbuchstabe, eine Zahl
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return strongPasswordRegex.test(password);
};

/**
 * Überprüft, ob zwei Passwörter übereinstimmen
 * @param {string} password - Das Hauptpasswort
 * @param {string} confirmPassword - Die Bestätigung des Passworts
 * @returns {boolean} Stimmen die Passwörter überein?
 */
export const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

/**
 * Überprüft, ob ein Benutzername gültig ist
 * @param {string} username - Der zu prüfende Benutzername
 * @returns {boolean} Ist der Benutzername gültig?
 */
export const isValidUsername = (username) => {
  // Nur Buchstaben, Zahlen, Unterstriche, min 3, max 20 Zeichen
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

/**
 * Überprüft, ob ein Gewichtswert gültig ist
 * @param {number|string} weight - Das zu prüfende Gewicht
 * @returns {boolean} Ist der Gewichtswert gültig?
 */
export const isValidWeight = (weight) => {
  const weightValue = parseFloat(weight);
  return !isNaN(weightValue) && weightValue > 0 && weightValue < 500;
};

/**
 * Überprüft, ob ein Wert für eine Wiederholungszahl gültig ist
 * @param {number|string} reps - Die zu prüfende Wiederholungszahl
 * @returns {boolean} Ist die Wiederholungszahl gültig?
 */
export const isValidReps = (reps) => {
  const repsValue = parseInt(reps);
  return !isNaN(repsValue) && repsValue > 0 && repsValue <= 100;
};

/**
 * Überprüft, ob ein Textfeld nicht leer ist
 * @param {string} value - Der zu prüfende Wert
 * @returns {boolean} Ist der Wert nicht leer?
 */
export const isNotEmpty = (value) => {
  return typeof value === 'string' && value.trim().length > 0;
};

/**
 * Überprüft, ob ein Wert innerhalb eines angegebenen Bereichs liegt
 * @param {number} value - Der zu prüfende Wert
 * @param {number} min - Minimaler Wert
 * @param {number} max - Maximaler Wert
 * @returns {boolean} Liegt der Wert im angegebenen Bereich?
 */
export const isInRange = (value, min, max) => {
  const numValue = parseFloat(value);
  return !isNaN(numValue) && numValue >= min && numValue <= max;
};

/**
 * Überprüft ein komplettes Registrierungsformular
 * @param {object} userData - Die zu prüfenden Registrierungsdaten
 * @returns {object} Validierungsergebnis mit Fehlern und Gesamtstatus
 */
export const validateRegistration = (userData) => {
  const errors = {};
  
  // Benutzername validieren
  if (!isValidUsername(userData.username)) {
    errors.username = 'Der Benutzername muss zwischen 3 und 20 Zeichen lang sein und darf nur Buchstaben, Zahlen und Unterstriche enthalten.';
  }
  
  // E-Mail validieren
  if (!isValidEmail(userData.email)) {
    errors.email = 'Bitte gib eine gültige E-Mail-Adresse ein.';
  }
  
  // Passwort validieren
  if (!isStrongPassword(userData.password)) {
    errors.password = 'Das Passwort muss mindestens 8 Zeichen lang sein und mindestens einen Großbuchstaben, einen Kleinbuchstaben und eine Zahl enthalten.';
  }
  
  // Passwortbestätigung validieren
  if (!passwordsMatch(userData.password, userData.confirmPassword)) {
    errors.confirmPassword = 'Die Passwörter stimmen nicht überein.';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Überprüft ein Login-Formular
 * @param {object} credentials - Die zu prüfenden Anmeldedaten
 * @returns {object} Validierungsergebnis mit Fehlern und Gesamtstatus
 */
export const validateLogin = (credentials) => {
  const errors = {};
  
  if (!isNotEmpty(credentials.username)) {
    errors.username = 'Bitte gib deinen Benutzernamen ein.';
  }
  
  if (!isNotEmpty(credentials.password)) {
    errors.password = 'Bitte gib dein Passwort ein.';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Überprüft ein Workout-Formular
 * @param {object} workoutData - Die zu prüfenden Workout-Daten
 * @returns {object} Validierungsergebnis mit Fehlern und Gesamtstatus
 */
export const validateWorkout = (workoutData) => {
  const errors = {};
  
  if (!isNotEmpty(workoutData.name)) {
    errors.name = 'Bitte gib einen Namen für das Workout ein.';
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
