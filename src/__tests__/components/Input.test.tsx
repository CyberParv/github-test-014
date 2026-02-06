import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '@/src/components/ui/Input';

describe('Input', () => {
  test('renders with associated label for accessibility', () => {
    render(
      <div>
        <label htmlFor="email">Email</label>
        <Input id="email" name="email" />
      </div>
    );
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  test('accepts user typing', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <label htmlFor="name">Name</label>
        <Input id="name" name="name" />
      </div>
    );

    const input = screen.getByLabelText('Name');
    await user.type(input, 'Mario');
    expect(input).toHaveValue('Mario');
  });

  test('shows error state (aria-invalid) when provided', () => {
    render(
      <div>
        <label htmlFor="phone">Phone</label>
        {/* @ts-ignore */}
        <Input id="phone" name="phone" error="Invalid phone" />
      </div>
    );
    const input = screen.getByLabelText('Phone');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });
});
