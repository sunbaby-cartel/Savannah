import { BadRequestException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { rethrowPrismaError } from './prisma-errors';

// Retry serialization conflicts so concurrent item edits cannot overwrite totals.
export async function orderTransaction<T>(
  prisma: PrismaService,
  operation: (tx: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await prisma.$transaction(operation, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2034' &&
        attempt < 2
      )
        continue;
      return rethrowPrismaError(error);
    }
  }
}

export function checkMoney(value: Prisma.Decimal): Prisma.Decimal {
  if (value.isNegative() || value.greaterThan('99999999.99')) {
    throw new BadRequestException(
      'Calculated amount exceeds the supported range',
    );
  }
  return value;
}

export async function refreshOrderTotals(
  tx: Prisma.TransactionClient,
  orderId: string,
) {
  const order = await tx.order.findUniqueOrThrow({ where: { id: orderId } });
  const sum = await tx.orderItem.aggregate({
    where: { orderId },
    _sum: { lineTotal: true },
  });
  const subtotal = checkMoney(sum._sum.lineTotal ?? new Prisma.Decimal(0));
  await tx.order.update({
    where: { id: orderId },
    data: { subtotal, total: checkMoney(subtotal.plus(order.tax)) },
  });
}
