import React from 'react';
import { render } from '@testing-library/react';
import ExerciseList from '../../../src/components/features/exercises/ExerciseList';

describe('ExerciseList', () => {
  it('renders without crashing', () => {
    render(<ExerciseList exercises={[]} isLoading={false} error={null} />);
  });
});
