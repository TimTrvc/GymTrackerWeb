import React from 'react';
import PrivateRoute from './PrivateRoute';

/**
 * Higher-order component that wraps a component with PrivateRoute
 * Follows the Single Responsibility Principle by focusing on one task
 * 
 * @param {React.ComponentType} Component - The component to be protected
 * @returns {JSX.Element} The wrapped component
 */
export const withPrivateRoute = (Component) => (
  <PrivateRoute>
    <Component />
  </PrivateRoute>
);
