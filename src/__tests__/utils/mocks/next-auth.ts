export type MockSessionUser = {
  id: string;
  email: string;
  role?: 'USER' | 'ADMIN';
  name?: string;
};

export function mockSession(user?: Partial<MockSessionUser>) {
  const session = user
    ? {
        user: {
          id: user.id || 'u_1',
          email: user.email || 'user@example.com',
          role: user.role || 'USER',
          name: user.name || 'Test User',
        },
        expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      }
    : null;

  return session;
}

jest.mock('next-auth', () => ({
  __esModule: true,
  getServerSession: jest.fn(),
}));

jest.mock('next-auth/react', () => ({
  __esModule: true,
  signIn: jest.fn(),
  signOut: jest.fn(),
  useSession: jest.fn(() => ({ data: null, status: 'unauthenticated' })),
}));
