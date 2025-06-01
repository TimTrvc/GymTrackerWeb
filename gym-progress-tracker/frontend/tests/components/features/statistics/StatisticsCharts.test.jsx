import React from 'react';
import { render } from '@testing-library/react';
import StatisticsCharts from '../../../src/components/features/statistics/StatisticsCharts';

describe('StatisticsCharts', () => {
  it('renders without crashing', () => {
    render(<StatisticsCharts frequencyData={[]} progressData={[]} />);
  });
});
