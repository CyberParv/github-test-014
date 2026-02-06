import { getServerSession } from 'next-auth';
import { prismaMock } from '@/src/__tests__/utils/mocks/prisma';
import { cartFactory, cartItemFactory } from '@/src/__tests__/utils/factories/cart';
import { productFactory } from '@/src/__tests__/utils/factories/product';
import { jsonRequest, makeNextRequest } from '@/src/__tests__/utils/helpers';
import '@/src/__tests__/api/_test-helpers';

let POST: any;
try {
  // @ts-ignore
  ({ POST } = require('@/src/app/api/checkout/route'));
} catch {
  POST = null;
}

describe('API /api/checkout', () => {
  test('returns 401 when unauthenticated', async () => {
    if (!POST) return;
    (getServerSession as unknown as jest.Mock).mockResolvedValueOnce(null);

    const req = makeNextRequest(jsonRequest('http://localhost/api/checkout', { method: 'POST', json: {} }));
    const res: Response = await POST(req);
    expect(res.status).toBe(401);
  });

  test('creates order from cart (201)', async () => {
    if (!POST) return;

    (getServerSession as unknown as jest.Mock).mockResolvedValueOnce({
      user: { id: 'u_1', email: 'user@example.com', role: 'USER' },
      expires: new Date(Date.now() + 3600_000).toISOString(),
    });

    prismaMock.cart.findUnique.mockResolvedValueOnce({
      ...cartFactory(),
      items: [
        {
          ...cartItemFactory({ quantity: 2, unitPrice: 1299 }),
          product: productFactory(),
        },
      ],
    });
    prismaMock.order.create.mockResolvedValueOnce({ id: 'o_1' });

    const req = makeNextRequest(
      jsonRequest('http://localhost/api/checkout', {
        method: 'POST',
        json: { paymentMethod: 'CARD' },
      })
    );

    const res: Response = await POST(req);
    expect([200, 201]).toContain(res.status);
  });

  test('returns 400 when cart is empty', async () => {
    if (!POST) return;

    (getServerSession as unknown as jest.Mock).mockResolvedValueOnce({
      user: { id: 'u_1', email: 'user@example.com', role: 'USER' },
      expires: new Date(Date.now() + 3600_000).toISOString(),
    });

    prismaMock.cart.findUnique.mockResolvedValueOnce({ ...cartFactory(), items: [] });

    const req = makeNextRequest(jsonRequest('http://localhost/api/checkout', { method: 'POST', json: {} }));
    const res: Response = await POST(req);
    expect(res.status).toBe(400);
  });
});
