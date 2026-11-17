import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReservationsService } from './reservations.service';

describe('ReservationsService', () => {
  const reservation = {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  };
  const service = new ReservationsService({
    reservation,
  } as unknown as PrismaService);
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('stores reservation dates at UTC midnight without shifting the local booking time', async () => {
    await service.create({
      customerName: 'Guest',
      reservationDate: '2026-11-17',
      reservationTime: '18:30',
      guestCount: 2,
      tableNumber: 'T1',
    });
    const data = reservation.create.mock.calls[0][0].data;
    expect(data.reservationDate.toISOString()).toBe('2026-11-17T00:00:00.000Z');
    expect(data.reservationTime).toBe('18:30');
  });

  it('preserves omitted dates and permits clearing the optional customer link', async () => {
    await service.update('reservation-id', { customerId: null, guestCount: 3 });
    expect(reservation.update).toHaveBeenCalledWith({
      where: { id: 'reservation-id' },
      data: expect.objectContaining({
        reservationDate: undefined,
        customerId: null,
        guestCount: 3,
      }),
    });
  });

  it('returns 404 for a missing reservation', async () => {
    reservation.findUnique.mockResolvedValue(null);
    await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
  });
});
