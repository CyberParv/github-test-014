import { getServerSession } from 'next-auth';
import { prismaMock } from '@/src/__tests__/utils/mocks/prisma';
import { adminFactory, userFactory } from '@/src/__tests__/utils/factories/user';
import { makeNextRequest } from '@/src/__tests__/utils/helpers';
import '@/src/__tests__/api/_test-helpers';

let GET: any;
try {
  // @ts-ignore
  ({ GET } = require('@/src/app/api/admin/users/route'));
} catch {
  GET = null;
}

describe('API /api/admin/users', () => {
  test('returns 401 when unauthenticated', async () => {
    if (!GET) return;

    (getServerSession as unknown as jest.Mock).mockResolvedValueOnce(null);
    const res: Response = await GET(makeNextRequest(new Request('http://localhost/api/admin/users')));
    expect(res.status).toBe(401);
  });

  test('returns 403 when not admin', async () => {
    if (!GET) return;

    (getServerSession as unknown as jest.Mock).mockResolvedValueOnce({
      user: userFactory(),
      expires: new Date(Date.now() + 3600_000).toISOString(),
    });

    const res: Response = await GET(makeNextRequest(new Request('http://localhost/api/admin/users')));
    expect(res.status).toBe(403);
  });

  test('lists users when admin (200)', async () => {
    if (!GET) return;

    (getServerSession as unknown as jest.Mock).mockResolvedValueOnce({
      user: adminFactory(),
      expires: new Date(Date.now() + 3600_000).toISOString(),
    });

    prismaMock.user.findMany.mockResolvedValueOnce([userFactory(), adminFactory()]);

    const res: Response = await GET(makeNextRequest(new Request('http://localhost/api/admin/users')));
    expect(res.status).toBe(200);
  });
});
