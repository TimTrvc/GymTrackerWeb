import React from 'react';
import { render, screen } from '@testing-library/react';
import HeroSection from '../../src/components/layout/HeroSection';

describe('HeroSection', () => {
  it('renders with title and subtitle', () => {
    render(<HeroSection title="Test Title" subtitle="Test Subtitle" />);
    expect(screen.getByText(/test title/i)).toBeInTheDocument();
    expect(screen.getByText(/test subtitle/i)).toBeInTheDocument();
  });
});
