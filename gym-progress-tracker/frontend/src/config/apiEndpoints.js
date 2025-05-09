/**
 * Zentrale Konfiguration aller API-Endpunkte
 * Dient als Single Source of Truth für alle API-Pfade (DRY-Prinzip)
 */

// Basis-URL für alle API-Aufrufe
const API_BASE = '/api';

// Benutzer-bezogene Endpunkte
export const USER_ENDPOINTS = {
  BASE: `${API_BASE}/users`,
  LOGIN: `${API_BASE}/users/login`,
  REGISTER: `${API_BASE}/users/register`,
  PROFILE: `${API_BASE}/users/profile`,
  ME: `${API_BASE}/users/me`,
  CONNECTIONS: `${API_BASE}/user-connections`
};

// Workout-bezogene Endpunkte
export const WORKOUT_ENDPOINTS = {
  TEMPLATES: `${API_BASE}/workout-templates`,
  WORKOUTS: `${API_BASE}/workouts`,
  EXERCISES: `${API_BASE}/workout-exercises`
};

// Übungs-bezogene Endpunkte
export const EXERCISE_ENDPOINTS = {
  BASE: `${API_BASE}/exercises`,
  CATEGORIES: `${API_BASE}/exercise-categories`,
  PERFORMANCE: `${API_BASE}/exercise-performance`,
  TEMPLATE: `${API_BASE}/template-exercises`
};

// Statistik-bezogene Endpunkte
export const STATS_ENDPOINTS = {
  ACTIVITY: `${API_BASE}/activity-stats`,
  BODY: `${API_BASE}/body-measurements`,
  GOALS: `${API_BASE}/goals`,
  NUTRITION: `${API_BASE}/nutrition-logs`,
  RECORDS: `${API_BASE}/personal-records`,
  SESSIONS: `${API_BASE}/training-sessions`,
  WEIGHT: `${API_BASE}/user-weight-logs`
};

// Sonstige Endpunkte
export const OTHER_ENDPOINTS = {
  EMAIL: `${API_BASE}/emails`,
  ADMIN: `${API_BASE}/admin`
};

// Kombinierte Export aller Endpunkte
export default {
  API_BASE,
  USER: USER_ENDPOINTS,
  WORKOUT: WORKOUT_ENDPOINTS,
  EXERCISE: EXERCISE_ENDPOINTS,
  STATS: STATS_ENDPOINTS,
  OTHER: OTHER_ENDPOINTS
};
