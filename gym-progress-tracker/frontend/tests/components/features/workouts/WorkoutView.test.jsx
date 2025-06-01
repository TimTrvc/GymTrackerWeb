import React from 'react';
import { render, screen } from '@testing-library/react';
import WorkoutView from '../../../src/components/features/workouts/WorkoutView';

describe('WorkoutView', () => {
  it('renders without crashing', () => {
    render(<WorkoutView workouts={[]} />);
    expect(screen.getByText(/workout/i)).toBeInTheDocument();
  });
});
