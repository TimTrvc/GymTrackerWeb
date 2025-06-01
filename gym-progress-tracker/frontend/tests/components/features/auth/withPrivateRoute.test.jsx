import React from 'react';
import { render } from '@testing-library/react';
import { withPrivateRoute } from '../../../src/components/features/auth/withPrivateRoute';

describe('withPrivateRoute', () => {
  it('wraps component with PrivateRoute', () => {
    const Dummy = () => <div>Dummy</div>;
    render(withPrivateRoute(Dummy));
  });
});
