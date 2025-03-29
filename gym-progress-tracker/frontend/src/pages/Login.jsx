import React, { useState } from 'react';
import AuthTabs from '@/components/auth/AuthTab.jsx';
import { login, register } from '@/services/authService.js';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (formData) => {
    setError('');
    setIsLoading(true);

    try {
      await login(formData);
      setIsLoading(false);
      window.location.href = '/';
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
    }
  };

  const handleRegister = async (formData) => {
    setError('');
    setIsLoading(true);

    try {
      await register(formData);
      setIsLoading(false);
      window.location.href = '/';
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-6">GymTrack</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
          {error}
        </div>
      )}

      <AuthTabs
        onLogin={handleLogin}
        onRegister={handleRegister}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Login;
