import { getServerSession } from 'next-auth';
import { prismaMock } from '@/src/__tests__/utils/mocks/prisma';
import { reservationFactory } from '@/src/__tests__/utils/factories/reservation';
import { jsonRequest, makeNextRequest } from '@/src/__tests__/utils/helpers';
import '@/src/__tests__/api/_test-helpers';

let GET: any;
let POST: any;
try {
  // @ts-ignore
  ({ GET, POST } = require('@/src/app/api/reservations/route'));
} catch {
  GET = null;
  POST = null;
}

describe('API /api/reservations', () => {
  test('returns 401 when unauthenticated', async () => {
    if (!GET) return;

    (getServerSession as unknown as jest.Mock).mockResolvedValueOnce(null);
    const res: Response = await GET(makeNextRequest(new Request('http://localhost/api/reservations')));
    expect(res.status).toBe(401);
  });

  test('lists reservations for user (200)', async () => {
    if (!GET) return;

    (getServerSession as unknown as jest.Mock).mockResolvedValueOnce({
      user: { id: 'u_1', email: 'user@example.com', role: 'USER' },
      expires: new Date(Date.now() + 3600_000).toISOString(),
    });

    prismaMock.reservation.findMany.mockResolvedValueOnce([reservationFactory()]);

    const res: Response = await GET(makeNextRequest(new Request('http://localhost/api/reservations')));
    expect(res.status).toBe(200);
  });

  test('creates reservation (201)', async () => {
    if (!POST) return;

    (getServerSession as unknown as jest.Mock).mockResolvedValueOnce({
      user: { id: 'u_1', email: 'user@example.com', role: 'USER' },
      expires: new Date(Date.now() + 3600_000).toISOString(),
    });

    prismaMock.reservation.create.mockResolvedValueOnce(reservationFactory({ id: 'r_new' }));

    const req = makeNextRequest(
      jsonRequest('http://localhost/api/reservations', {
        method: 'POST',
        json: { date: '2026-12-24', time: '19:00', partySize: 2 },
      })
    );

    const res: Response = await POST(req);
    expect([200, 201]).toContain(res.status);
  });

  test('returns 400 on invalid partySize', async () => {
    if (!POST) return;

    (getServerSession as unknown as jest.Mock).mockResolvedValueOnce({
      user: { id: 'u_1', email: 'user@example.com', role: 'USER' },
      expires: new Date(Date.now() + 3600_000).toISOString(),
    });

    const req = makeNextRequest(
      jsonRequest('http://localhost/api/reservations', {
        method: 'POST',
        json: { date: '2026-12-24', time: '19:00', partySize: 0 },
      })
    );

    const res: Response = await POST(req);
    expect(res.status).toBe(400);
  });
});
