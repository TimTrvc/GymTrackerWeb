import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { AuthContext } from '../context/AuthContext';
import HeroSection from '../components/layout/HeroSection';

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
    }
  }, [isAuthenticated]);

  return (
    <>
      <HeroSection
        title="Verfolge deinen Fitness-Fortschritt"
        subtitle="Mit GymTrack kannst du deine Workouts protokollieren, Fortschritte verfolgen und deine Fitnessziele erreichen."
        button={
          !isAuthenticated && (
            <Link
              to="/login"
              className="bg-white text-indigo-700 px-6 py-3 rounded-lg font-bold text-lg hover:bg-indigo-100 transition"
            >
              Jetzt starten
            </Link>
          )
        }
      />

      <div className="container mx-auto px-4 py-8">
        {isAuthenticated && (
          <>
            <div className="mb-12 bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Fortschritt hinzufügen</h2>
            </div>
          </>
        )}

        {!isAuthenticated && (
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Melde dich an, um deine Fortschritte zu verfolgen
            </h2>
            <p className="mb-6 text-gray-600">
              Mit einem Konto kannst du deine Workouts protokollieren und deinen Fortschritt im Blick behalten.
            </p>
            <Link
              to="/login"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition"
            >
              Jetzt anmelden oder registrieren
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
