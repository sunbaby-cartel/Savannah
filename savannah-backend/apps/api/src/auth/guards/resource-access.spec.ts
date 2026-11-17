import 'reflect-metadata';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { StaffRole } from '../../../generated/prisma/enums';
import { CustomersController } from '../../customers/customers.controller';
import { OrdersController } from '../../orders/orders.controller';
import { OrderItemsController } from '../../order_items/order_items.controller';
import { ReservationsController } from '../../reservations/reservations.controller';
import { ActivitiesController } from '../../activities/activities.controller';
import { RolesGuard } from './roles.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

const controllers = [
  CustomersController,
  OrdersController,
  OrderItemsController,
  ReservationsController,
  ActivitiesController,
];
const methods = ['findAll', 'findOne', 'create', 'update', 'remove'] as const;

describe.each(controllers)('%s resource permissions', (controller) => {
  const guard = new RolesGuard(new Reflector());
  function context(method: (typeof methods)[number], role?: string) {
    return {
      getHandler: () => controller.prototype[method],
      getClass: () => controller,
      switchToHttp: () => ({
        getRequest: () => ({ user: role ? { role } : undefined }),
      }),
    } as unknown as ExecutionContext;
  }

  it('requires JWT authentication before checking roles', () => {
    expect(Reflect.getMetadata('__guards__', controller)).toEqual([
      JwtAuthGuard,
      RolesGuard,
    ]);
  });

  it.each(methods)('enforces the role policy for %s', (method) => {
    const privileged =
      method === 'remove' ||
      (controller === ActivitiesController &&
        ['create', 'update'].includes(method));
    if (privileged)
      expect(() =>
        guard.canActivate(context(method, StaffRole.cashier)),
      ).toThrow(ForbiddenException);
    else
      expect(guard.canActivate(context(method, StaffRole.cashier))).toBe(true);
    for (const role of [StaffRole.manager, StaffRole.admin])
      expect(guard.canActivate(context(method, role))).toBe(true);
    expect(() => guard.canActivate(context(method))).toThrow(
      ForbiddenException,
    );
    expect(() => guard.canActivate(context(method, 'unknown'))).toThrow(
      ForbiddenException,
    );
  });
});
