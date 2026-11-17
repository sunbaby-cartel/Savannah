import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { databaseOperation } from './prisma-errors';

describe('Database errors', () => {
  it.each([
    ['P2025', NotFoundException],
    ['P2002', ConflictException],
    ['P2003', ConflictException],
    ['P2000', BadRequestException],
    ['P2020', BadRequestException],
    ['P2034', ConflictException],
  ] as const)(
    'maps %s to the appropriate HTTP error',
    async (code, expected) => {
      await expect(
        databaseOperation(async () => {
          throw new Prisma.PrismaClientKnownRequestError('Database detail', {
            code,
            clientVersion: 'test',
          });
        }),
      ).rejects.toThrow(expected);
    },
  );

  it('preserves unexpected errors', async () => {
    const error = new Error('Connection unavailable');
    await expect(
      databaseOperation(async () => {
        throw error;
      }),
    ).rejects.toBe(error);
  });
});
