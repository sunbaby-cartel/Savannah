import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';

export function rethrowPrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2025':
        throw new NotFoundException('Record not found');
      case 'P2002':
        throw new ConflictException(
          'A record with this unique value already exists',
        );
      case 'P2003':
        throw new ConflictException(
          'A referenced record does not exist or is still in use',
        );
      case 'P2000':
      case 'P2020':
        throw new BadRequestException('A value exceeds the database limits');
      case 'P2034':
        throw new ConflictException(
          'Concurrent change; please retry the request',
        );
    }
  }
  throw error;
}

export async function databaseOperation<T>(
  operation: () => Promise<T>,
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    return rethrowPrismaError(error);
  }
}
