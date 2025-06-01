import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WorkoutNav from '../../../src/components/features/workouts/WorkoutNav';

describe('WorkoutNav', () => {
  it('renders tabs and handles click', () => {
    const handleTabClick = jest.fn();
    render(<WorkoutNav activeTab="create" handleTabClick={handleTabClick} />);
    expect(screen.getByText(/workout erstellen/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/workout erstellen/i));
    expect(handleTabClick).toHaveBeenCalled();
  });
});
