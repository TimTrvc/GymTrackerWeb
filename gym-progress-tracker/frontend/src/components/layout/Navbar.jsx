import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-lg overflow-visible">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Left: Logo */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-2xl font-bold text-white flex items-center">
            <span className="mr-2">💪</span> GymTrack
          </Link>
        </div>

        {/* Right: Links */}
        <div className="flex items-center space-x-12">
          {isAuthenticated && (
            <>
              {/* Training Dropdown */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('training')}
                  className="hover:text-indigo-200 flex items-center space-x-1 focus:outline-none"
                >
                  <span>Training</span>
                  <span className="text-sm">▼</span>
                </button>
                {activeDropdown === 'training' && (
                  <div
                    className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20"
                  >
                    <div className="py-1">
                      <Link
                        to="/exercises"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100"
                        onClick={() => setActiveDropdown(null)}
                      >
                        Übungen
                      </Link>
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100"
                        onClick={() => setActiveDropdown(null)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/statistics"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100"
                        onClick={() => setActiveDropdown(null)}
                      >
                        Statistiken
                      </Link>
                      <Link
                        to="/workouts"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100"
                        onClick={() => setActiveDropdown(null)}
                      >
                        Workouts
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Body Dropdown */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('body')}
                  className="hover:text-indigo-200 flex items-center space-x-1 focus:outline-none"
                >
                  <span>Body</span>
                  <span className="text-sm">▼</span>
                </button>
                {activeDropdown === 'body' && (
                  <div
                    // Position to the left or right to avoid overflow:
                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20"
                  >
                    <div className="py-1">
                      <Link
                        to="/nutrition"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100"
                        onClick={() => setActiveDropdown(null)}
                      >
                        Ernährung
                      </Link>
                      <Link
                        to="/body"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100"
                        onClick={() => setActiveDropdown(null)}
                      >
                        Körpermaße
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="bg-white text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100"
              >
                Logout
              </button>
            </>
          )}

          {!isAuthenticated && (
            <Link
              to="/login"
              className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
