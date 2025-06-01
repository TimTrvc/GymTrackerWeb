import React from 'react';
import { render } from '@testing-library/react';
import BodyModel3D from '../../../src/components/features/body/BodyModel3D';

describe('BodyModel3D', () => {
  it('renders without crashing', () => {
    render(<BodyModel3D />);
  });
});
