import React from 'react';
import { render } from '@testing-library/react';
import HomeAvatarWidget from '../../../src/components/features/avatar/HomeAvatarWidget';

describe('HomeAvatarWidget', () => {
  it('renders without crashing', () => {
    render(<HomeAvatarWidget />);
  });
});
