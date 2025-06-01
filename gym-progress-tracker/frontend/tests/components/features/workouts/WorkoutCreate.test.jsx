import React from 'react';
import { render } from '@testing-library/react';
import WorkoutCreate from '../../../src/components/features/workouts/WorkoutCreate';

describe('WorkoutCreate', () => {
  it('renders without crashing', () => {
    render(<WorkoutCreate handleWorkoutSubmit={() => {}} />);
  });
});
