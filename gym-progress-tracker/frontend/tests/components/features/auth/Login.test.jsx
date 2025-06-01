import React from 'react';
import { render } from '@testing-library/react';
import Login from '../../../src/components/features/auth/Login';

describe('Login', () => {
  it('renders without crashing', () => {
    render(<Login />);
  });
});
