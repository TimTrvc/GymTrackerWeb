import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorDisplay from '../../../../src/components/common/ErrorDisplay';

describe('ErrorDisplay', () => {
  it('renders default error message', () => {
    render(<ErrorDisplay />);
    expect(screen.getByText(/ein fehler ist aufgetreten/i)).toBeInTheDocument();
  });
});
