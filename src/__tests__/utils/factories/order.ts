export function orderFactory(overrides: Partial<any> = {}) {
  return {
    id: 'o_1',
    userId: 'u_1',
    total: 1299,
    status: 'PAID',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    ...overrides,
  };
}
