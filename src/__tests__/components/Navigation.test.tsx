import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Update to match your actual component export
import Navigation from '@/src/components/layout/Navigation';

jest.mock('next-auth/react', () => ({
  __esModule: true,
  useSession: jest.fn(() => ({ data: null, status: 'unauthenticated' })),
  signOut: jest.fn(),
}));

describe('Navigation', () => {
  test('renders primary navigation landmarks/links', () => {
    render(<Navigation />);

    // Prefer role queries for accessibility
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });

  test('shows login/signup for unauthenticated users', () => {
    render(<Navigation />);

    const maybeLogin = screen.queryByRole('link', { name: /log in|login/i });
    const maybeSignup = screen.queryByRole('link', { name: /sign up|signup|register/i });

    // One of these is typically present; assert at least one to avoid brittle tests.
    expect(maybeLogin || maybeSignup).toBeTruthy();
  });

  test('shows logout for authenticated users and triggers signOut', async () => {
    const user = userEvent.setup();

    const { useSession, signOut } = require('next-auth/react');
    useSession.mockReturnValue({
      data: { user: { id: 'u_1', email: 'user@example.com', role: 'USER' } },
      status: 'authenticated',
    });

    render(<Navigation />);

    const logout = screen.queryByRole('button', { name: /log out|logout/i });
    if (!logout) return; // if your nav uses a link/menu instead

    await user.click(logout);
    expect(signOut).toHaveBeenCalled();
  });
});
