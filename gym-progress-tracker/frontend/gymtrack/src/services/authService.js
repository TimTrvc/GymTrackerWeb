import api from './api';

export const login = async (username, password) => {
  try {
    const response = await api.post('/api/users/login', { username, password });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || 'Anmeldung fehlgeschlagen'
    );
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/api/users/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || 'Registrierung fehlgeschlagen'
    );
  }
};

export const checkAuth = async () => {
  try {
    const response = await api.get('/api/users/me');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Authentifizierung fehlgeschlagen');
  }
};
