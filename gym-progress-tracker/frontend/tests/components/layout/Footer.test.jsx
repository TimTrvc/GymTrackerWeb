import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../../src/components/layout/Footer';
import { AuthContext } from '../../src/context/AuthContext';
import { MemoryRouter } from 'react-router';

describe('Footer', () => {
  it('renders without crashing', () => {
    render(
      <AuthContext.Provider value={{ isAuthenticated: false, logoutUser: jest.fn() }}>
        <MemoryRouter>
          <Footer />
        </MemoryRouter>
      </AuthContext.Provider>
    );
    expect(screen.getByText(/newsletter/i)).toBeInTheDocument();
  });
});
