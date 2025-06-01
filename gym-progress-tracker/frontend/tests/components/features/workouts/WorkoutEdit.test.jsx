import React from 'react';
import { render } from '@testing-library/react';
import WorkoutEdit from '../../../src/components/features/workouts/WorkoutEdit';

describe('WorkoutEdit', () => {
  it('renders without crashing', () => {
    render(<WorkoutEdit workouts={[]} />);
  });
});
