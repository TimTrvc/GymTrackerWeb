import React from 'react';
import { render } from '@testing-library/react';
import AvatarGame from '../../../src/components/features/avatar/AvatarGame';

describe('AvatarGame', () => {
  it('renders without crashing', () => {
    render(<AvatarGame />);
  });
});
