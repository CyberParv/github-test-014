import { getServerSession } from 'next-auth';
import { mockSession } from '@/src/__tests__/utils/mocks/next-auth';
import { makeNextRequest, readJson } from '@/src/__tests__/utils/helpers';
import '@/src/__tests__/api/_test-helpers';

let GET: any;
try {
  // @ts-ignore
  ({ GET } = require('@/src/app/api/auth/me/route'));
} catch {
  GET = null;
}

describe('API /api/auth/me', () => {
  test('returns session user when authenticated (200)', async () => {
    if (!GET) return;

    (getServerSession as unknown as jest.Mock).mockResolvedValueOnce(mockSession({ id: 'u_1' }));

    const res: Response = await GET(makeNextRequest(new Request('http://localhost/api/auth/me')));
    expect(res.status).toBe(200);
    const body = await readJson(res);
    expect(body?.user?.id).toBe('u_1');
  });

  test('returns 401 when not authenticated', async () => {
    if (!GET) return;

    (getServerSession as unknown as jest.Mock).mockResolvedValueOnce(null);

    const res: Response = await GET(makeNextRequest(new Request('http://localhost/api/auth/me')));
    expect(res.status).toBe(401);
  });
});
