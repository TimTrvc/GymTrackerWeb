import React from 'react';
import { render, screen } from '@testing-library/react';
import { TextField } from '../../../src/components/common/FormElements';

describe('TextField', () => {
  it('renders label and input', () => {
    render(<TextField id="test" label="Test Label" />);
    expect(screen.getByLabelText(/test label/i)).toBeInTheDocument();
  });

  it('shows error message if error prop is set', () => {
    render(<TextField id="test" label="Test Label" error="Fehler" />);
    expect(screen.getByText(/fehler/i)).toBeInTheDocument();
  });
});
