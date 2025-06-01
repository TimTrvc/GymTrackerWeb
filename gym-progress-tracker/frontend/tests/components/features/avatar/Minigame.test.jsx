import React from 'react';
import { render } from '@testing-library/react';
import Minigame from '../../../src/components/features/avatar/Minigame';

describe('Minigame', () => {
  it('renders without crashing', () => {
    render(<Minigame />);
  });
});
