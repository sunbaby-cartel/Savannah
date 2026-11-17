import { NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersService } from './orders.service';

describe('OrdersService', () => {
  const order = {
    create: jest.fn(),
    findUnique: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const transaction = jest.fn();
  const service = new OrdersService({
    order,
    $transaction: transaction,
  } as unknown as PrismaService);
  beforeEach(() => {
    jest.resetAllMocks();
    transaction.mockImplementation(
      async (operation: (tx: { order: typeof order }) => Promise<unknown>) =>
        operation({ order }),
    );
    order.create.mockImplementation(async ({ data }) => data);
    order.update.mockImplementation(async ({ data }) => data);
    order.findUniqueOrThrow.mockResolvedValue({
      subtotal: new Prisma.Decimal('10.20'),
      tax: new Prisma.Decimal('1.10'),
      completedAt: null,
    });
  });

  it('generates an order number and starts with no items', async () => {
    const result = await service.create({
      customerName: 'Guest',
      orderType: 'takeaway',
      tax: 1.1,
    });
    expect(result.orderNumber).toMatch(/^ORD-/);
    expect(result.subtotal).toBe(0);
    expect(result.total.toString()).toBe('1.1');
  });

  it('recalculates total when tax changes without losing the current subtotal', async () => {
    const result = await service.update('order-id', { tax: 2.3 });
    expect(result.total.toString()).toBe('12.5');
    expect(order.update.mock.calls[0][0].where).toEqual({ id: 'order-id' });
  });

  it('sets and clears completion time with the status', async () => {
    expect(
      (await service.update('order-id', { status: 'completed' })).completedAt,
    ).toBeInstanceOf(Date);
    expect(
      (await service.update('order-id', { status: 'pending' })).completedAt,
    ).toBeNull();
  });

  it('returns 404 for a missing order', async () => {
    order.findUnique.mockResolvedValue(null);
    await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
  });
});
