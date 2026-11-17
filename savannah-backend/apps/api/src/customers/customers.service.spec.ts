import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CustomersService } from './customers.service';

describe('CustomersService', () => {
  const customer = {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const service = new CustomersService({
    customer,
  } as unknown as PrismaService);
  beforeEach(() => {
    jest.resetAllMocks();
    customer.create.mockImplementation(async ({ data }) => data);
  });

  it('normalizes email and generates a customer number', async () => {
    const result = await service.create({
      name: 'Guest',
      email: 'Guest@Example.com',
      phone: '1234',
    });
    expect(result.email).toBe('guest@example.com');
    expect(result.customerNumber).toMatch(/^CUS-/);
  });

  it('keeps string IDs and omitted fields on a partial update', async () => {
    await service.update('customer-id', { notes: 'No peanuts' });
    expect(customer.update).toHaveBeenCalledWith({
      where: { id: 'customer-id' },
      data: expect.objectContaining({ notes: 'No peanuts', email: undefined }),
    });
  });

  it('returns 404 for missing customers', async () => {
    customer.findUnique.mockResolvedValue(null);
    await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
  });
});
