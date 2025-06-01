import React from 'react';
import { render } from '@testing-library/react';
import AuthTab from '../../../src/components/features/auth/AuthTab';

describe('AuthTab', () => {
  it('renders without crashing', () => {
    render(<AuthTab />);
  });
});
