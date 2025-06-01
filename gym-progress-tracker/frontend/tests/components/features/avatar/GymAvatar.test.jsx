import React from 'react';
import { render } from '@testing-library/react';
import GymAvatar from '../../../src/components/features/avatar/GymAvatar';

describe('GymAvatar', () => {
  it('renders without crashing', () => {
    render(<GymAvatar />);
  });
});
