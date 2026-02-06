import { getServerSession } from 'next-auth';
import { prismaMock, resetPrismaMock } from '@/src/__tests__/utils/mocks/prisma';

jest.mock('@/src/lib/prisma', () => ({
  __esModule: true,
  prisma: prismaMock,
}));

export const getServerSessionMock = getServerSession as unknown as jest.Mock;

beforeEach(() => {
  resetPrismaMock();
  getServerSessionMock.mockReset();
});
