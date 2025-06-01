import React from 'react';
import { render, screen } from '@testing-library/react';
import { FormInput } from '../../src/components/ui/FormElements';

describe('FormInput', () => {
  it('renders without crashing', () => {
    render(<FormInput name="test" label="Test Label" />);
    expect(screen.getByLabelText(/test label/i)).toBeInTheDocument();
  });

  it('shows error message if error prop is set', () => {
    render(<FormInput name="test" label="Test Label" error="Fehler" />);
    expect(screen.getByText(/fehler/i)).toBeInTheDocument();
  });
});
