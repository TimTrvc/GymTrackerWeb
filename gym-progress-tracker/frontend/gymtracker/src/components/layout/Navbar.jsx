import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white flex items-center">
          <span className="mr-2">💪</span> GymTrack
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/" className="hover:text-indigo-200">Dashboard</Link>
          {isAuthenticated && (
            <>
              <Link to="/workouts" className="hover:text-indigo-200">Workouts</Link>
              <Link to="/exercises" className="hover:text-indigo-200">Übungen</Link>
              <Link to="/statistics" className="hover:text-indigo-200">Statistiken</Link>
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
