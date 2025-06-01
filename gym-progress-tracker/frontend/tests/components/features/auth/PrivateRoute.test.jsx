import React from 'react';
import { render } from '@testing-library/react';
import PrivateRoute from '../../../src/components/features/auth/PrivateRoute';

describe('PrivateRoute', () => {
  it('renders children if authenticated', () => {
    jest.mock('../../../src/hooks/useAuth', () => () => ({ isAuthenticated: true, loading: false }));
    render(<PrivateRoute><div>Protected</div></PrivateRoute>);
  });
});
