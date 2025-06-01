import React from 'react';
import { render } from '@testing-library/react';
import WorkoutTabs from '../../../src/components/features/workouts/WorkoutTabs';

describe('WorkoutTabs', () => {
  it('renders without crashing', () => {
    render(<WorkoutTabs />);
  });
});
