import React from 'react';
import { render } from '@testing-library/react';
import WorkoutSession from '../../../src/components/features/workouts/WorkoutSession';

describe('WorkoutSession', () => {
  it('renders without crashing', () => {
    render(<WorkoutSession workout={{}} exercises={[]} onFinish={() => {}} />);
  });
});
