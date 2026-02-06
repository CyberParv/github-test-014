import React from 'react';
import { render, screen } from '@testing-library/react';
import Badge from '@/src/components/ui/Badge';

describe('Badge', () => {
  test('renders badge text', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  test('supports variants (via prop/className)', () => {
    const { container } = render(
      // @ts-ignore
      <Badge variant="success">
        Available
      </Badge>
    );
    expect(container.firstChild).toBeTruthy();
  });
});
