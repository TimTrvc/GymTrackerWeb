import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

/**
 * Custom Hook für den einfachen Zugriff auf Authentifizierungsfunktionen
 * Vereinfacht die Verwendung des AuthContext in Komponenten (KISS-Prinzip)
 * 
 * @returns {Object} Authentifizierungsmethoden und -zustände
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth muss innerhalb eines AuthProvider verwendet werden');
  }
  
  return context;
};

export default useAuth;
