export function productFactory(overrides: Partial<any> = {}) {
  return {
    id: 'p_1',
    name: 'Margherita Pizza',
    description: 'Classic tomato, mozzarella, basil',
    price: 1299,
    imageUrl: 'https://example.com/pizza.jpg',
    category: 'pizza',
    isAvailable: true,
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    ...overrides,
  };
}
