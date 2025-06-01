import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from '../../src/components/layout/Navbar';
import { AuthContext } from '../../src/context/AuthContext';
import { MemoryRouter } from 'react-router';

describe('Navbar', () => {
  it('renders without crashing', () => {
    render(
      <AuthContext.Provider value={{ isAuthenticated: false }}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </AuthContext.Provider>
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
