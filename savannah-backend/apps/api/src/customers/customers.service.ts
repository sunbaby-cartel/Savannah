import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { databaseOperation } from '../common/prisma-errors';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateCustomerDto) {
    return databaseOperation(() =>
      this.prisma.customer.create({
        data: {
          name: dto.name,
          email: dto.email.trim().toLowerCase(),
          phone: dto.phone,
          customerNumber: dto.customerNumber ?? `CUS-${randomUUID()}`,
          status: dto.status,
          dietaryPreferences: dto.dietaryPreferences,
          notes: dto.notes,
        },
      }),
    );
  }

  findAll() {
    return this.prisma.customer.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    if (!customer) throw new NotFoundException(`Customer ${id} not found`);
    return customer;
  }

  update(id: string, dto: UpdateCustomerDto) {
    return databaseOperation(() =>
      this.prisma.customer.update({
        where: { id },
        data: {
          name: dto.name,
          email: dto.email?.trim().toLowerCase(),
          phone: dto.phone,
          customerNumber: dto.customerNumber,
          status: dto.status,
          dietaryPreferences: dto.dietaryPreferences,
          notes: dto.notes,
        },
      }),
    );
  }

  remove(id: string) {
    return databaseOperation(() =>
      this.prisma.customer.delete({ where: { id } }),
    );
  }
}
