import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  checkMoney,
  orderTransaction,
  refreshOrderTotals,
} from '../common/order-transaction';
import { CreateOrderItemDto } from './dto/create-order_item.dto';
import { UpdateOrderItemDto } from './dto/update-order_item.dto';

@Injectable()
export class OrderItemsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateOrderItemDto) {
    return orderTransaction(this.prisma, async (tx) => {
      await tx.order.findUniqueOrThrow({ where: { id: dto.orderId } });
      const menuItem = await tx.menuItem.findUniqueOrThrow({
        where: { id: dto.menuItemId },
      });
      const item = await tx.orderItem.create({
        data: {
          orderId: dto.orderId,
          menuItemId: dto.menuItemId,
          menuItemName: menuItem.name,
          quantity: dto.quantity,
          unitPrice: menuItem.price,
          lineTotal: checkMoney(menuItem.price.times(dto.quantity)),
        },
      });
      await refreshOrderTotals(tx, dto.orderId);
      return item;
    });
  }

  findAll() {
    return this.prisma.orderItem.findMany({ orderBy: { id: 'asc' } });
  }

  async findOne(id: string) {
    const item = await this.prisma.orderItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`Order item ${id} not found`);
    return item;
  }

  update(id: string, dto: UpdateOrderItemDto) {
    return orderTransaction(this.prisma, async (tx) => {
      const current = await tx.orderItem.findUniqueOrThrow({ where: { id } });
      const quantity = dto.quantity ?? current.quantity;
      const item = await tx.orderItem.update({
        where: { id },
        data: {
          quantity,
          lineTotal: checkMoney(current.unitPrice.times(quantity)),
        },
      });
      await refreshOrderTotals(tx, current.orderId);
      return item;
    });
  }

  remove(id: string) {
    return orderTransaction(this.prisma, async (tx) => {
      const item = await tx.orderItem.delete({ where: { id } });
      await refreshOrderTotals(tx, item.orderId);
      return item;
    });
  }
}
