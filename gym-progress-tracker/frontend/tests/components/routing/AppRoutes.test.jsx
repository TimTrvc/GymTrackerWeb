import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import AppRoutes from '../../src/components/routing/AppRoutes';

describe('AppRoutes', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <AppRoutes />
      </MemoryRouter>
    );
  });
});
