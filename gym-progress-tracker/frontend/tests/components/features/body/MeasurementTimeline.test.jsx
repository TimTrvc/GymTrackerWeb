import React from 'react';
import { render } from '@testing-library/react';
import MeasurementTimeline from '../../../src/components/features/body/MeasurementTimeline';

describe('MeasurementTimeline', () => {
  it('renders without crashing', () => {
    render(<MeasurementTimeline measurements={[]} selectedPart="chest" onClose={() => {}} onDelete={() => {}} />);
  });
});
