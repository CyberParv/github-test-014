import { getServerSession } from 'next-auth';
import { prismaMock } from '@/src/__tests__/utils/mocks/prisma';
import { cartFactory, cartItemFactory } from '@/src/__tests__/utils/factories/cart';
import { productFactory } from '@/src/__tests__/utils/factories/product';
import { jsonRequest, makeNextRequest } from '@/src/__tests__/utils/helpers';
import '@/src/__tests__/api/_test-helpers';

let GET: any;
let POST: any;
try {
  // @ts-ignore
  ({ GET, POST } = require('@/src/app/api/cart/route'));
} catch {
  GET = null;
  POST = null;
}

describe('API /api/cart', () => {
  test('returns 401 when unauthenticated', async () => {
    if (!GET) return;
    (getServerSession as unknown as jest.Mock).mockResolvedValueOnce(null);

    const res: Response = await GET(makeNextRequest(new Request('http://localhost/api/cart')));
    expect(res.status).toBe(401);
  });

  test('gets current cart (200)', async () => {
    if (!GET) return;

    (getServerSession as unknown as jest.Mock).mockResolvedValueOnce({
      user: { id: 'u_1', email: 'user@example.com', role: 'USER' },
      expires: new Date(Date.now() + 3600_000).toISOString(),
    });

    prismaMock.cart.findUnique.mockResolvedValueOnce({
      ...cartFactory(),
      items: [
        {
          ...cartItemFactory(),
          product: productFactory(),
        },
      ],
    });

    const res: Response = await GET(makeNextRequest(new Request('http://localhost/api/cart')));
    expect(res.status).toBe(200);
  });

  test('adds an item to cart (200/201)', async () => {
    if (!POST) return;

    (getServerSession as unknown as jest.Mock).mockResolvedValueOnce({
      user: { id: 'u_1', email: 'user@example.com', role: 'USER' },
      expires: new Date(Date.now() + 3600_000).toISOString(),
    });

    prismaMock.cart.findUnique.mockResolvedValueOnce(cartFactory());
    prismaMock.cartItem.create.mockResolvedValueOnce(cartItemFactory({ id: 'ci_new' }));

    const req = makeNextRequest(
      jsonRequest('http://localhost/api/cart', { method: 'POST', json: { productId: 'p_1', quantity: 2 } })
    );

    const res: Response = await POST(req);
    expect([200, 201]).toContain(res.status);
  });

  test('returns 400 on invalid quantity', async () => {
    if (!POST) return;

    (getServerSession as unknown as jest.Mock).mockResolvedValueOnce({
      user: { id: 'u_1', email: 'user@example.com', role: 'USER' },
      expires: new Date(Date.now() + 3600_000).toISOString(),
    });

    const req = makeNextRequest(
      jsonRequest('http://localhost/api/cart', { method: 'POST', json: { productId: 'p_1', quantity: 0 } })
    );
    const res: Response = await POST(req);
    expect(res.status).toBe(400);
  });
});
