import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '@/src/components/ui/Button';

describe('Button', () => {
  test('renders with label and is accessible by role', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  test('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Add</Button>);

    await user.click(screen.getByRole('button', { name: 'Add' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('disabled state prevents clicking', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <Button onClick={onClick} disabled>
        Add
      </Button>
    );

    await user.click(screen.getByRole('button', { name: 'Add' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  test('supports loading state (aria-busy or disabled)', () => {
    // If your Button has isLoading prop, adjust accordingly.
    render(
      // @ts-ignore
      <Button isLoading>
        Add
      </Button>
    );

    const btn = screen.getByRole('button', { name: 'Add' });
    expect(btn).toHaveAttribute('disabled');
  });
});
