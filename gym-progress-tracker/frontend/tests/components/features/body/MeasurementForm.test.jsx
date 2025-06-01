import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MeasurementForm from '../../../src/components/features/body/MeasurementForm';

describe('MeasurementForm', () => {
  it('renders and submits value', () => {
    const onSubmit = jest.fn();
    render(<MeasurementForm selectedPart="chest" onSubmit={onSubmit} onCancel={() => {}} />);
    fireEvent.change(screen.getByLabelText(/brustumfang/i), { target: { value: '100' } });
    fireEvent.click(screen.getByRole('button'));
    expect(onSubmit).toHaveBeenCalled();
  });
});
