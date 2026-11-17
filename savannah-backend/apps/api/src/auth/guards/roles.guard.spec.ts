import 'reflect-metadata';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { StaffRole } from '../../../generated/prisma/enums';
import { MenuItemsController } from '../../menu_items/menu_items.controller';
import { RolesGuard } from './roles.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('Menu item access policy', () => {
  const guard = new RolesGuard(new Reflector());
  function context(method: keyof MenuItemsController, role?: StaffRole) {
    return {
      getHandler: () => MenuItemsController.prototype[method],
      getClass: () => MenuItemsController,
      switchToHttp: () => ({
        getRequest: () => ({ user: role ? { role } : undefined }),
      }),
    } as unknown as ExecutionContext;
  }

  it('checks JWT authentication before roles on every menu endpoint', () => {
    expect(Reflect.getMetadata('__guards__', MenuItemsController)).toEqual([
      JwtAuthGuard,
      RolesGuard,
    ]);
  });

  it.each([StaffRole.cashier, StaffRole.manager, StaffRole.admin])(
    'allows %s to read menu items',
    (role) => {
      expect(guard.canActivate(context('findAll', role))).toBe(true);
      expect(guard.canActivate(context('findOne', role))).toBe(true);
    },
  );

  it.each(['create', 'update', 'remove'] as const)(
    'restricts %s to managers and admins',
    (method) => {
      expect(() =>
        guard.canActivate(context(method, StaffRole.cashier)),
      ).toThrow(ForbiddenException);
      expect(() => guard.canActivate(context(method))).toThrow(
        ForbiddenException,
      );
      expect(guard.canActivate(context(method, StaffRole.manager))).toBe(true);
      expect(guard.canActivate(context(method, StaffRole.admin))).toBe(true);
    },
  );
});
