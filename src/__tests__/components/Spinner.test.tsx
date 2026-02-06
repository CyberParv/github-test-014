import React from 'react';
import { render, screen } from '@testing-library/react';
import Spinner from '@/src/components/ui/Spinner';

describe('Spinner', () => {
  test('renders with status role or aria-label for accessibility', () => {
    render(
      // @ts-ignore
      <Spinner label="Loading" />
    );

    const el = screen.queryByRole('status') || screen.getByLabelText(/loading/i);
    expect(el).toBeInTheDocument();
  });
});
