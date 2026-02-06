export function userFactory(overrides: Partial<any> = {}) {
  return {
    id: 'u_1',
    email: 'user@example.com',
    name: 'Test User',
    role: 'USER',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    ...overrides,
  };
}

export function adminFactory(overrides: Partial<any> = {}) {
  return userFactory({ id: 'a_1', email: 'admin@example.com', role: 'ADMIN', name: 'Admin', ...overrides });
}
