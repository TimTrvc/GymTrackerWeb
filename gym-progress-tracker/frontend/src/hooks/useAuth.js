import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';


/**
 * React hook for accessing authentication methods and state from AuthContext.
 * Simplifies usage of AuthContext in components.
 *
 * @returns {Object} Authentication methods and state from AuthContext.
 * @throws {Error} If used outside of an AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
