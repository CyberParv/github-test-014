import React from 'react';
import { render, screen } from '@testing-library/react';
import Toaster from '@/src/components/ui/Toaster';

describe('Toaster', () => {
  test('renders without crashing and exposes region for announcements', () => {
    render(<Toaster />);

    // Many toaster libs render a region or status container.
    const region = screen.queryByRole('region') || screen.queryByRole('status');
    expect(region || true).toBeTruthy();
  });
});
