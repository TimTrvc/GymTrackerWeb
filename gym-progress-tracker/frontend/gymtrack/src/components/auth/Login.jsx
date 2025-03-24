import React, { useState } from 'react';

const Login = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
          Benutzername
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
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
          value={formData.password}
          onChange={handleChange}
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
            checked={formData.rememberMe}
            onChange={handleChange}
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
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Anmelden
        </button>
      </div>
    </form>
  );
};

export default Login;
