import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { OrderItemsService } from './order_items.service';

const decimal = (value: number) => new Prisma.Decimal(value);
const missing = () =>
  new Prisma.PrismaClientKnownRequestError('Missing', {
    code: 'P2025',
    clientVersion: 'test',
  });

describe('OrderItemsService', () => {
  const tx = {
    order: { findUniqueOrThrow: jest.fn(), update: jest.fn() },
    menuItem: { findUniqueOrThrow: jest.fn() },
    orderItem: {
      create: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      aggregate: jest.fn(),
    },
  };
  const transaction = jest.fn();
  const service = new OrderItemsService({
    $transaction: transaction,
  } as unknown as PrismaService);

  beforeEach(() => {
    jest.resetAllMocks();
    transaction.mockImplementation(
      async (operation: (client: typeof tx) => Promise<unknown>) =>
        operation(tx),
    );
    tx.order.findUniqueOrThrow.mockResolvedValue({
      id: 'order-1',
      tax: decimal(1.2),
    });
    tx.menuItem.findUniqueOrThrow.mockResolvedValue({
      id: 'menu-1',
      name: 'Tea',
      price: decimal(3.15),
    });
    tx.orderItem.findUniqueOrThrow.mockResolvedValue({
      id: 'item-1',
      orderId: 'order-1',
      quantity: 2,
      unitPrice: decimal(3.15),
    });
    tx.orderItem.aggregate.mockResolvedValue({
      _sum: { lineTotal: decimal(6.3) },
    });
    tx.orderItem.create.mockImplementation(async ({ data }) => ({
      id: 'item-1',
      ...data,
    }));
  });

  it('snapshots menu price and name and recalculates totals within one transaction', async () => {
    const item = await service.create({
      orderId: 'order-1',
      menuItemId: 'menu-1',
      quantity: 2,
    });
    expect(item.menuItemName).toBe('Tea');
    expect(item.lineTotal.toString()).toBe('6.3');
    const totals = tx.order.update.mock.calls[0][0].data;
    expect(totals.subtotal.toString()).toBe('6.3');
    expect(totals.total.toString()).toBe('7.5');
    expect(transaction).toHaveBeenCalledWith(expect.any(Function), {
      isolationLevel: 'Serializable',
    });
  });

  it('uses the original price when quantity changes', async () => {
    await service.update('item-1', { quantity: 3 });
    expect(tx.orderItem.update.mock.calls[0][0].data.lineTotal.toString()).toBe(
      '9.45',
    );
    expect(tx.menuItem.findUniqueOrThrow).not.toHaveBeenCalled();
  });

  it('resets the subtotal to zero after the last item is deleted', async () => {
    tx.orderItem.delete.mockResolvedValue({ id: 'item-1', orderId: 'order-1' });
    tx.orderItem.aggregate.mockResolvedValue({ _sum: { lineTotal: null } });
    await service.remove('item-1');
    const totals = tx.order.update.mock.calls[0][0].data;
    expect(totals.subtotal.toString()).toBe('0');
    expect(totals.total.toString()).toBe('1.2');
  });

  it('rejects missing related records without inserting an item', async () => {
    tx.menuItem.findUniqueOrThrow.mockRejectedValue(missing());
    await expect(
      service.create({
        orderId: 'order-1',
        menuItemId: 'missing',
        quantity: 1,
      }),
    ).rejects.toThrow(NotFoundException);
    expect(tx.orderItem.create).not.toHaveBeenCalled();
  });

  it('rejects calculated amounts that overflow the database column', async () => {
    await expect(
      service.create({
        orderId: 'order-1',
        menuItemId: 'menu-1',
        quantity: 2147483647,
      }),
    ).rejects.toThrow(BadRequestException);
    expect(tx.orderItem.create).not.toHaveBeenCalled();
  });

  it('retries serialization conflicts and limits the number of retries', async () => {
    const conflict = new Prisma.PrismaClientKnownRequestError('Conflict', {
      code: 'P2034',
      clientVersion: 'test',
    });
    transaction.mockRejectedValueOnce(conflict);
    await service.create({
      orderId: 'order-1',
      menuItemId: 'menu-1',
      quantity: 2,
    });
    expect(transaction).toHaveBeenCalledTimes(2);
    transaction.mockClear().mockRejectedValue(conflict);
    await expect(service.update('item-1', { quantity: 2 })).rejects.toThrow(
      'Concurrent change',
    );
    expect(transaction).toHaveBeenCalledTimes(3);
  });
});
