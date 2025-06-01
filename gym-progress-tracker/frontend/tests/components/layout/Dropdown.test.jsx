import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Dropdown from '../../src/components/layout/Dropdown';

describe('Dropdown', () => {
  it('renders dropdown title', () => {
    render(<Dropdown dropdown_title="Test Dropdown" dropdown_items={[]} />);
    expect(screen.getByText(/test dropdown/i)).toBeInTheDocument();
  });
});
