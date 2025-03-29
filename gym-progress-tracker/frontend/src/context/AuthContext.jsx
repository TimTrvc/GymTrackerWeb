import React, { createContext, useState, useEffect } from 'react';
import { login, register } from '@/services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      const userId = localStorage.getItem('userId');
      const username = localStorage.getItem('username');
      setUser({ id: userId, username: username });
    }
    setLoading(false);
  }, [token]);

  const loginUser = async (username, password) => {
    try {
      const response = await login(username, password);
      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', response.user.id);
      localStorage.setItem('username', response.user.username);
      setToken(response.token);
      setUser(response.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Anmeldung fehlgeschlagen' };
    }
  };

  const registerUser = async (userData) => {
    try {
      const response = await register(userData);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message || 'Registrierung fehlgeschlagen' };
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        loginUser,
        registerUser,
        logoutUser,
        isAuthenticated: !!token
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
