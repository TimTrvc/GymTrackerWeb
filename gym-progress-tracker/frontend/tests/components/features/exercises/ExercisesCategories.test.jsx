import React from 'react';
import { render, screen } from '@testing-library/react';
import ExercisesCategories from '../../../src/components/features/exercises/ExercisesCategories';

describe('ExercisesCategories', () => {
  it('renders empty state if no categories', () => {
    render(<ExercisesCategories categories={[]} onCategoryClick={() => {}} />);
    expect(screen.getByText(/keine \u00dcbungskategorien gefunden/i)).toBeInTheDocument();
  });
});
