type AnyFn = (...args: any[]) => any;

export type PrismaMock = {
  user: Record<string, jest.Mock>;
  product: Record<string, jest.Mock>;
  cart: Record<string, jest.Mock>;
  cartItem: Record<string, jest.Mock>;
  order: Record<string, jest.Mock>;
  reservation: Record<string, jest.Mock>;
};

function modelMock(methods: string[]): Record<string, jest.Mock> {
  return methods.reduce((acc, m) => {
    acc[m] = jest.fn() as unknown as jest.Mock;
    return acc;
  }, {} as Record<string, jest.Mock>);
}

export const prismaMock: PrismaMock = {
  user: modelMock(['findUnique', 'findMany', 'create', 'update', 'delete']),
  product: modelMock(['findUnique', 'findMany', 'create', 'update', 'delete']),
  cart: modelMock(['findUnique', 'findMany', 'create', 'update', 'delete']),
  cartItem: modelMock(['findUnique', 'findMany', 'create', 'update', 'delete']),
  order: modelMock(['findUnique', 'findMany', 'create', 'update', 'delete']),
  reservation: modelMock(['findUnique', 'findMany', 'create', 'update', 'delete']),
};

export function resetPrismaMock() {
  Object.values(prismaMock).forEach((model) => {
    Object.values(model).forEach((fn) => fn.mockReset());
  });
}
