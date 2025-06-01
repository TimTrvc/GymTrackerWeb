import React from 'react';
import { render } from '@testing-library/react';
import AddExerciseModal from '../../../src/components/features/exercises/AddExerciseModal';

describe('AddExerciseModal', () => {
  it('renders without crashing', () => {
    render(<AddExerciseModal isOpen={true} onClose={() => {}} exerciseCategories={[]} onAddExercise={() => {}} />);
  });
});
