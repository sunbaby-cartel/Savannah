import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { databaseOperation } from '../common/prisma-errors';
import { checkMoney, orderTransaction } from '../common/order-transaction';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateOrderDto) {
    const tax = new Prisma.Decimal(dto.tax ?? 0);
    return databaseOperation(() =>
      this.prisma.order.create({
        data: {
          orderNumber: dto.orderNumber ?? `ORD-${randomUUID()}`,
          customerId: dto.customerId,
          customerName: dto.customerName,
          orderType: dto.orderType,
          tableNumber: dto.tableNumber,
          subtotal: 0,
          tax,
          total: checkMoney(tax),
          status: dto.status,
          notes: dto.notes,
          completedAt: dto.status === 'completed' ? new Date() : null,
        },
        include: { items: true },
      }),
    );
  }

  findAll() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    return order;
  }

  update(id: string, dto: UpdateOrderDto) {
    return orderTransaction(this.prisma, async (tx) => {
      const current = await tx.order.findUniqueOrThrow({ where: { id } });
      const tax =
        dto.tax === undefined ? current.tax : new Prisma.Decimal(dto.tax);
      return tx.order.update({
        where: { id },
        data: {
          orderNumber: dto.orderNumber,
          customerId: dto.customerId,
          customerName: dto.customerName,
          orderType: dto.orderType,
          tableNumber: dto.tableNumber,
          tax,
          total: checkMoney(current.subtotal.plus(tax)),
          status: dto.status,
          notes: dto.notes,
          completedAt:
            dto.status === undefined
              ? undefined
              : dto.status === 'completed'
                ? (current.completedAt ?? new Date())
                : null,
        },
        include: { items: true },
      });
    });
  }

  remove(id: string) {
    return databaseOperation(() => this.prisma.order.delete({ where: { id } }));
  }
}
