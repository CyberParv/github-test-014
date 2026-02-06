export function reservationFactory(overrides: Partial<any> = {}) {
  return {
    id: 'r_1',
    userId: 'u_1',
    date: '2026-12-24',
    time: '19:00',
    partySize: 2,
    notes: 'Window seat please',
    status: 'CONFIRMED',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    ...overrides,
  };
}
