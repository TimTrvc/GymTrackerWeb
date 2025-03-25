import React, { useState } from 'react';

const AuthTab = ({ onLogin, onRegister, isLoading }) => {
  const [activeTab, setActiveTab] = useState('login');

  // Login Form State
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });

  // Register Form State
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    height: '',
    agreeTerms: false
  });

  // Handle Login Form Changes
  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle Register Form Changes
  const handleRegisterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle Login Form Submit
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    onLogin(loginData);
  };

  // Handle Register Form Submit
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    onRegister(registerData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <div className="flex border-b mb-4">
        <button
          className={`py-2 px-4 ${activeTab === 'login'
            ? 'text-indigo-600 border-b-2 border-indigo-600'
            : 'text-gray-500'}`}
          onClick={() => setActiveTab('login')}
        >
          Anmelden
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'register'
            ? 'text-indigo-600 border-b-2 border-indigo-600'
            : 'text-gray-500'}`}
          onClick={() => setActiveTab('register')}
        >
          Registrieren
        </button>
      </div>

      {activeTab === 'login' ? (
        <form onSubmit={handleLoginSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
              Benutzername
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={loginData.username}
              onChange={handleLoginChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Dein Benutzername"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Passwort
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Dein Passwort"
              required
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={loginData.rememberMe}
                onChange={handleLoginChange}
                className="mr-2"
              />
              <label htmlFor="rememberMe" className="text-sm text-gray-600">
                Angemeldet bleiben
              </label>
            </div>
            <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800">
              Passwort vergessen?
            </a>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {isLoading ? 'Wird angemeldet...' : 'Anmelden'}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleRegisterSubmit}>
          {/* Username */}
          <div className="mb-4">
            <label htmlFor="register-username" className="block text-gray-700 text-sm font-bold mb-2">
              Benutzername*
            </label>
            <input
              type="text"
              id="register-username"
              name="username"
              value={registerData.username}
              onChange={handleRegisterChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Dein Benutzername"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="register-email" className="block text-gray-700 text-sm font-bold mb-2">
              E-Mail*
            </label>
            <input
              type="email"
              id="register-email"
              name="email"
              value={registerData.email}
              onChange={handleRegisterChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="deine@email.de"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="register-password" className="block text-gray-700 text-sm font-bold mb-2">
              Passwort*
            </label>
            <input
              type="password"
              id="register-password"
              name="password"
              value={registerData.password}
              onChange={handleRegisterChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Dein Passwort"
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label htmlFor="register-password-confirm" className="block text-gray-700 text-sm font-bold mb-2">
              Passwort bestätigen*
            </label>
            <input
              type="password"
              id="register-password-confirm"
              name="confirmPassword"
              value={registerData.confirmPassword}
              onChange={handleRegisterChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Passwort wiederholen"
              required
            />
          </div>

          {/* Name Fields - 2 columns */}
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="first-name" className="block text-gray-700 text-sm font-bold mb-2">
                Vorname
              </label>
              <input
                type="text"
                id="first-name"
                name="firstName"
                value={registerData.firstName}
                onChange={handleRegisterChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="last-name" className="block text-gray-700 text-sm font-bold mb-2">
                Nachname
              </label>
              <input
                type="text"
                id="last-name"
                name="lastName"
                value={registerData.lastName}
                onChange={handleRegisterChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div className="mb-4">
            <label htmlFor="date-of-birth" className="block text-gray-700 text-sm font-bold mb-2">
              Geburtsdatum
            </label>
            <input
              type="date"
              id="date-of-birth"
              name="dateOfBirth"
              value={registerData.dateOfBirth}
              onChange={handleRegisterChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          {/* Gender */}
          <div className="mb-4">
            <label htmlFor="gender" className="block text-gray-700 text-sm font-bold mb-2">
              Geschlecht
            </label>
            <select
              id="gender"
              name="gender"
              value={registerData.gender}
              onChange={handleRegisterChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Bitte wählen</option>
              <option value="männlich">Männlich</option>
              <option value="weiblich">Weiblich</option>
              <option value="divers">Divers</option>
            </select>
          </div>

          {/* Height */}
          <div className="mb-6">
            <label htmlFor="height" className="block text-gray-700 text-sm font-bold mb-2">
              Größe (cm)
            </label>
            <input
              type="number"
              id="height"
              name="height"
              value={registerData.height}
              onChange={handleRegisterChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          {/* Terms Agreement */}
          <div className="mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="agree-terms"
                name="agreeTerms"
                checked={registerData.agreeTerms}
                onChange={handleRegisterChange}
                className="mr-2"
                required
              />
              <label htmlFor="agree-terms" className="text-sm text-gray-600">
                Ich akzeptiere die <a href="#" className="text-indigo-600 hover:text-indigo-800">Nutzungsbedingungen</a>*
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {isLoading ? 'Wird registriert...' : 'Registrieren'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AuthTab;
