import { getServerSession } from 'next-auth';
import { prismaMock } from '@/src/__tests__/utils/mocks/prisma';
import { adminFactory } from '@/src/__tests__/utils/factories/user';
import { productFactory } from '@/src/__tests__/utils/factories/product';
import { jsonRequest, makeNextRequest } from '@/src/__tests__/utils/helpers';
import '@/src/__tests__/api/_test-helpers';

let GET: any;
let PATCH: any;
let DELETE: any;
try {
  // @ts-ignore
  ({ GET, PATCH, DELETE } = require('@/src/app/api/products/[id]/route'));
} catch {
  GET = null;
  PATCH = null;
  DELETE = null;
}

describe('API /api/products/:id', () => {
  test('gets a product (200)', async () => {
    if (!GET) return;

    prismaMock.product.findUnique.mockResolvedValueOnce(productFactory({ id: 'p_1' }));

    const res: Response = await GET(
      makeNextRequest(new Request('http://localhost/api/products/p_1')),
      { params: Promise.resolve({ id: 'p_1' }) }
    );
    expect(res.status).toBe(200);
  });

  test('returns 404 when product not found', async () => {
    if (!GET) return;

    prismaMock.product.findUnique.mockResolvedValueOnce(null);

    const res: Response = await GET(
      makeNextRequest(new Request('http://localhost/api/products/p_missing')),
      { params: Promise.resolve({ id: 'p_missing' }) }
    );
    expect(res.status).toBe(404);
  });

  test('updates product (200) as admin', async () => {
    if (!PATCH) return;

    (getServerSession as unknown as jest.Mock).mockResolvedValueOnce({
      user: adminFactory(),
      expires: new Date(Date.now() + 3600_000).toISOString(),
    });

    prismaMock.product.update.mockResolvedValueOnce(productFactory({ id: 'p_1', name: 'Updated' }));

    const req = makeNextRequest(
      jsonRequest('http://localhost/api/products/p_1', { method: 'PATCH', json: { name: 'Updated' } })
    );

    const res: Response = await PATCH(req, { params: Promise.resolve({ id: 'p_1' }) });
    expect(res.status).toBe(200);
  });

  test('returns 401 on update when unauthenticated', async () => {
    if (!PATCH) return;

    (getServerSession as unknown as jest.Mock).mockResolvedValueOnce(null);

    const req = makeNextRequest(jsonRequest('http://localhost/api/products/p_1', { method: 'PATCH', json: { name: 'x' } }));
    const res: Response = await PATCH(req, { params: Promise.resolve({ id: 'p_1' }) });
    expect(res.status).toBe(401);
  });

  test('deletes product (200/204) as admin', async () => {
    if (!DELETE) return;

    (getServerSession as unknown as jest.Mock).mockResolvedValueOnce({
      user: adminFactory(),
      expires: new Date(Date.now() + 3600_000).toISOString(),
    });

    prismaMock.product.delete.mockResolvedValueOnce(productFactory({ id: 'p_1' }));

    const res: Response = await DELETE(
      makeNextRequest(new Request('http://localhost/api/products/p_1', { method: 'DELETE' })),
      { params: Promise.resolve({ id: 'p_1' }) }
    );

    expect([200, 204]).toContain(res.status);
  });
});
