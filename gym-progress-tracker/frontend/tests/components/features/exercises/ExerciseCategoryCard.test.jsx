import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ExerciseCategoryCard from '../../../../src/components/features/exercises/ExerciseCategoryCard';

describe('ExerciseCategoryCard', () => {
  it('renders name and description', () => {
    render(<ExerciseCategoryCard name="Test" description="Desc" category_id={1} onCategoryClick={() => {}} />);
    expect(screen.getByText(/test/i)).toBeInTheDocument();
    expect(screen.getByText(/desc/i)).toBeInTheDocument();
  });

  it('calls onCategoryClick when clicked', () => {
    const onClick = jest.fn();
    render(<ExerciseCategoryCard name="Test" description="Desc" category_id={1} onCategoryClick={onClick} />);
    fireEvent.click(screen.getByText(/test/i));
    expect(onClick).toHaveBeenCalled();
  });
});
