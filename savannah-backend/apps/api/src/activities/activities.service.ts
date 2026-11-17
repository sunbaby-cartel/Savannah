import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { databaseOperation } from '../common/prisma-errors';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Injectable()
export class ActivitiesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateActivityDto) {
    return databaseOperation(() =>
      this.prisma.activity.create({
        data: {
          type: dto.type,
          message: dto.message,
          entityId: dto.entityId,
        },
      }),
    );
  }

  findAll() {
    return this.prisma.activity.findMany({ orderBy: { timestamp: 'desc' } });
  }

  async findOne(id: string) {
    const activity = await this.prisma.activity.findUnique({ where: { id } });
    if (!activity) throw new NotFoundException(`Activity ${id} not found`);
    return activity;
  }

  update(id: string, dto: UpdateActivityDto) {
    return databaseOperation(() =>
      this.prisma.activity.update({
        where: { id },
        data: {
          type: dto.type,
          message: dto.message,
          entityId: dto.entityId,
        },
      }),
    );
  }

  remove(id: string) {
    return databaseOperation(() =>
      this.prisma.activity.delete({ where: { id } }),
    );
  }
}
