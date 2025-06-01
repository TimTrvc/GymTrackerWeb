import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CategoryView from '../../../src/components/features/exercises/CategoryView';

describe('CategoryView', () => {
  it('renders title and button', () => {
    render(<CategoryView categories={[]} onCategoryClick={() => {}} onAddExerciseClick={() => {}} />);
    expect(screen.getByText(/kategorien/i)).toBeInTheDocument();
    expect(screen.getByText(/\u00dcbung hinzuf\u00fcgen/i)).toBeInTheDocument();
  });

  it('calls onAddExerciseClick when button is clicked', () => {
    const onAdd = jest.fn();
    render(<CategoryView categories={[]} onCategoryClick={() => {}} onAddExerciseClick={onAdd} />);
    fireEvent.click(screen.getByText(/\u00dcbung hinzuf\u00fcgen/i));
    expect(onAdd).toHaveBeenCalled();
  });
});
