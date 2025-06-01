import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingDisplay from '../../../../src/components/common/LoadingDisplay';

describe('LoadingDisplay', () => {
  it('renders default message', () => {
    render(<LoadingDisplay />);
    expect(screen.getByText(/wird geladen/i)).toBeInTheDocument();
  });
});
