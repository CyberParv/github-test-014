export function cartFactory(overrides: Partial<any> = {}) {
  return {
    id: 'c_1',
    userId: 'u_1',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    ...overrides,
  };
}

export function cartItemFactory(overrides: Partial<any> = {}) {
  return {
    id: 'ci_1',
    cartId: 'c_1',
    productId: 'p_1',
    quantity: 1,
    unitPrice: 1299,
    ...overrides,
  };
}
