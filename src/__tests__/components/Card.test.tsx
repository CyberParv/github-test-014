import React from 'react';
import { render, screen } from '@testing-library/react';
import Card from '@/src/components/ui/Card';

describe('Card', () => {
  test('renders children content', () => {
    render(
      <Card>
        <h2>Title</h2>
        <p>Body</p>
      </Card>
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
  });

  test('supports different variants via props/className', () => {
    const { container, rerender } = render(
      // @ts-ignore
      <Card variant="outlined">
        Content
      </Card>
    );
    expect(container.firstChild).toBeTruthy();

    rerender(
      <Card className="custom-class">
        Content
      </Card>
    );
    expect(container.querySelector('.custom-class')).toBeTruthy();
  });
});
