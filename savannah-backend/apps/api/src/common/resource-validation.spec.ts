import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { CreateCustomerDto } from '../customers/dto/create-customer.dto';
import { UpdateCustomerDto } from '../customers/dto/update-customer.dto';
import { CreateOrderDto } from '../orders/dto/create-order.dto';
import { CreateOrderItemDto } from '../order_items/dto/create-order_item.dto';
import { UpdateOrderItemDto } from '../order_items/dto/update-order_item.dto';
import { CreateReservationDto } from '../reservations/dto/create-reservation.dto';
import { CreateActivityDto } from '../activities/dto/create-activity.dto';

const pipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
});
const reservation = {
  customerName: 'Guest',
  reservationDate: '2026-11-17',
  reservationTime: '18:30',
  guestCount: 2,
  tableNumber: 'T1',
};
const cases = [
  {
    metatype: CreateCustomerDto,
    valid: { name: 'Customer', email: 'guest@example.com', phone: '12345' },
  },
  {
    metatype: CreateOrderDto,
    valid: { customerName: 'Walk-in', orderType: 'dine_in' },
  },
  {
    metatype: CreateOrderItemDto,
    valid: { orderId: 'order-1', menuItemId: 'menu-1', quantity: 2 },
  },
  { metatype: CreateReservationDto, valid: reservation },
  {
    metatype: CreateActivityDto,
    valid: { type: 'order_created', message: 'New order' },
  },
];

describe('Resource DTO validation', () => {
  it.each(cases)(
    'validates required fields and blocks server-owned fields ($metatype.name)',
    async ({ metatype, valid }) => {
      await expect(
        pipe.transform(valid, { type: 'body', metatype }),
      ).resolves.toBeDefined();
      await expect(
        pipe.transform({}, { type: 'body', metatype }),
      ).rejects.toThrow(BadRequestException);
      await expect(
        pipe.transform(
          { ...valid, id: 'injected' },
          { type: 'body', metatype },
        ),
      ).rejects.toThrow(BadRequestException);
    },
  );

  it.each([
    { quantity: 0 },
    { quantity: -1 },
    { quantity: 1.5 },
    { quantity: '2' },
    { quantity: null },
    { quantity: 2, orderId: 'another-order' },
    { quantity: 2, unitPrice: 0 },
  ])(
    'rejects invalid quantities or changes to an item snapshot (%j)',
    async (body) => {
      await expect(
        pipe.transform(body, { type: 'body', metatype: UpdateOrderItemDto }),
      ).rejects.toThrow(BadRequestException);
    },
  );

  it.each([
    { reservationDate: '2026-02-30' },
    { reservationDate: '2026-11-17T18:00:00Z' },
    { reservationTime: '24:00' },
    { guestCount: 0 },
    { status: 'unknown' },
  ])('rejects invalid reservation data (%j)', async (patch) => {
    await expect(
      pipe.transform(
        { ...reservation, ...patch },
        { type: 'body', metatype: CreateReservationDto },
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('allows partial updates and rejects null for required database columns', async () => {
    await expect(
      pipe.transform(
        { notes: 'Updated' },
        { type: 'body', metatype: UpdateCustomerDto },
      ),
    ).resolves.toEqual({ notes: 'Updated' });
    await expect(
      pipe.transform(
        { name: null },
        { type: 'body', metatype: UpdateCustomerDto },
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it.each([-1, 0.001, 100000000])(
    'rejects invalid tax amounts (%s)',
    async (tax) => {
      await expect(
        pipe.transform(
          { customerName: 'Guest', orderType: 'takeaway', tax },
          { type: 'body', metatype: CreateOrderDto },
        ),
      ).rejects.toThrow(BadRequestException);
    },
  );
});
