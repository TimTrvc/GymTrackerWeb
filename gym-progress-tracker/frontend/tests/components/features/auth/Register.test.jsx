import React from 'react';
import { render } from '@testing-library/react';
import Register from '../../../src/components/features/auth/Register';

describe('Register', () => {
  it('renders without crashing', () => {
    render(<Register />);
  });
});
