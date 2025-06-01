import React from 'react';
import { render } from '@testing-library/react';
import Hoverer from '../../../src/components/animation/Hoverer';

describe('Hoverer', () => {
  it('renders children', () => {
    render(<Hoverer>Test</Hoverer>);
  });
});
