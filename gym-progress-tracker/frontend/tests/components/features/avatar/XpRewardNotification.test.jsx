import React from 'react';
import { render } from '@testing-library/react';
import XpRewardNotification from '../../../src/components/features/avatar/XpRewardNotification';

describe('XpRewardNotification', () => {
  it('renders with message', () => {
    render(<XpRewardNotification message="XP erhalten!" />);
  });
});
