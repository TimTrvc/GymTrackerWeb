import React from 'react';
import { Navigate } from 'react-router';
import useAuth from '@/hooks/useAuth';

/**
 * Schutz für private Routen, die Authentifizierung erfordern
 * Folgt dem KISS-Prinzip durch klare, einfache Logik
 */
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Lade-Indikator während der Authentifizierungsprüfung
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Laden...</div>;
  }

  // Umleitung zur Login-Seite, wenn nicht authentifiziert
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Gebe die geschützten Kinder-Komponenten zurück, wenn authentifiziert
  return children;
};

export default PrivateRoute;
