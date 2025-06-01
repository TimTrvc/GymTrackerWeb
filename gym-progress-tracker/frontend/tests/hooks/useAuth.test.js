import { renderHook } from '@testing-library/react-hooks';
import { useAuth } from '../../src/hooks/useAuth';
import React from 'react';

const mockContext = { isAuthenticated: true, user: { name: 'Tim' } };
const AuthContext = React.createContext();

describe('useAuth', () => {
  it('returns context value', () => {
    const wrapper = ({ children }) => (
      <AuthContext.Provider value={mockContext}>{children}</AuthContext.Provider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user.name).toBe('Tim');
  });

  it('throws if used outside provider', () => {
    expect(() => renderHook(() => useAuth())).toThrow();
  });
});
