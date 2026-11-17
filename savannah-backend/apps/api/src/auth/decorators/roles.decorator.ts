import { SetMetadata } from '@nestjs/common';
import { StaffRole } from '../../../generated/prisma/enums';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: StaffRole[]) => SetMetadata(ROLES_KEY, roles);
