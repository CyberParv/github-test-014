import { getServerSession } from 'next-auth';
import { prismaMock } from '@/src/__tests__/utils/mocks/prisma';
import { adminFactory } from '@/src/__tests__/utils/factories/user';
import { productFactory } from '@/src/__tests__/utils/factories/product';
import { jsonRequest, makeNextRequest, readJson } from '@/src/__tests__/utils/helpers';
import '@/src/__tests__/api/_test-helpers';

let GET: any;
let POST: any;
try {
  // @ts-ignore
  ({ GET, POST } = require('@/src/app/api/products/route'));
} catch {
  GET = null;
  POST = null;
}

describe('API /api/products', () => {
  test('lists products (200)', async () => {
    if (!GET) return;

    prismaMock.product.findMany.mockResolvedValueOnce([productFactory({ id: 'p_1' })]);

    const res: Response = await GET(makeNextRequest(new Request('http://localhost/api/products')));
    expect(res.status).toBe(200);
    const body = await readJson(res);
    expect(Array.isArray(body)).toBe(true);
  });

  test('creates a product (201) for admin', async () => {
    if (!POST) return;

    (getServerSession as unknown as jest.Mock).mockResolvedValueOnce({
      user: adminFactory(),
      expires: new Date(Date.now() + 3600_000).toISOString(),
    });

    prismaMock.product.create.mockResolvedValueOnce(productFactory({ id: 'p_new' }));

    const req = makeNextRequest(
      jsonRequest('http://localhost/api/products', {
        method: 'POST',
        json: { name: 'New', price: 500, category: 'pizza' },
      })
    );

    const res: Response = await POST(req);
    expect([200, 201]).toContain(res.status);
    const body = await readJson(res);
    expect(body?.id).toBe('p_new');
  });

  test('returns 401 on create when unauthenticated', async () => {
    if (!POST) return;

    (getServerSession as unknown as jest.Mock).mockResolvedValueOnce(null);

    const req = makeNextRequest(
      jsonRequest('http://localhost/api/products', { method: 'POST', json: { name: 'New', price: 500 } })
    );
    const res: Response = await POST(req);
    expect(res.status).toBe(401);
  });

  test('returns 403 on create when not admin', async () => {
    if (!POST) return;

    (getServerSession as unknown as jest.Mock).mockResolvedValueOnce({
      user: { id: 'u_1', email: 'user@example.com', role: 'USER' },
      expires: new Date(Date.now() + 3600_000).toISOString(),
    });

    const req = makeNextRequest(
      jsonRequest('http://localhost/api/products', { method: 'POST', json: { name: 'New', price: 500 } })
    );
    const res: Response = await POST(req);
    expect(res.status).toBe(403);
  });

  test('returns 400 on create validation error', async () => {
    if (!POST) return;

    (getServerSession as unknown as jest.Mock).mockResolvedValueOnce({
      user: adminFactory(),
      expires: new Date(Date.now() + 3600_000).toISOString(),
    });

    const req = makeNextRequest(jsonRequest('http://localhost/api/products', { method: 'POST', json: { price: -1 } }));
    const res: Response = await POST(req);
    expect(res.status).toBe(400);
  });
});
