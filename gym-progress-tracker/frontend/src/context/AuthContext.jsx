import React, { createContext, useState, useEffect, useCallback } from 'react';
import * as authService from '@/services/authService';

/**
 * Context für die Authentifizierung
 * Folgt den Prinzipien der Zustandskapselung und Single Responsibility
 */
export const AuthContext = createContext();

/**
 * Provider für den Authentifizierungskontext
 * Verwaltet den Authentifizierungszustand der Anwendung
 */
export const AuthProvider = ({ children }) => {
  // Zustandsvariablen mit sinnvollen Standardwerten
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem(authService.AUTH_KEYS.TOKEN) || null);
  const [loading, setLoading] = useState(true);

  // Benutzer beim ersten Laden aus dem LocalStorage wiederherstellen
  useEffect(() => {
    if (token) {
      const userId = localStorage.getItem(authService.AUTH_KEYS.USER_ID);
      const username = localStorage.getItem(authService.AUTH_KEYS.USERNAME);
      setUser({ id: userId, username });
    }
    setLoading(false);
  }, [token]);

  /**
   * Behandelt Antworten von Auth-Operationen konsistent (DRY-Prinzip)
   */
  const handleAuthResponse = useCallback((success, error = null, data = null) => {
    return {
      success,
      ...(error && { error: error.message || error }),
      ...(data && { data })
    };
  }, []);

  /**
   * Benutzeranmeldung
   */
  const loginUser = async (username, password, rememberMe = false) => {
    try {
      const response = await authService.login({ username, password, rememberMe });
      setToken(response.token);
      setUser(response.user);
      return handleAuthResponse(true, null, response);
    } catch (error) {
      return handleAuthResponse(false, error.message || 'Anmeldung fehlgeschlagen');
    }
  };

  /**
   * Benutzerregistrierung
   */
  const registerUser = async (userData) => {
    try {
      const response = await authService.register(userData);
      return handleAuthResponse(true, null, response);
    } catch (error) {
      return handleAuthResponse(false, error.message || 'Registrierung fehlgeschlagen');
    }
  };

  /**
   * Benutzerabmeldung
   */
  const logoutUser = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  // Werte, die dem Context zur Verfügung gestellt werden
  const contextValue = {
    user,
    token,
    loading,
    loginUser,
    registerUser,
    logoutUser,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
