import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { databaseOperation } from '../common/prisma-errors';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateReservationDto) {
    return databaseOperation(() =>
      this.prisma.reservation.create({
        data: {
          customerId: dto.customerId,
          customerName: dto.customerName,
          reservationDate: new Date(`${dto.reservationDate}T00:00:00.000Z`),
          reservationTime: dto.reservationTime,
          guestCount: dto.guestCount,
          tableNumber: dto.tableNumber,
          status: dto.status,
          specialRequests: dto.specialRequests,
        },
      }),
    );
  }

  findAll() {
    return this.prisma.reservation.findMany({
      orderBy: [{ reservationDate: 'asc' }, { reservationTime: 'asc' }],
    });
  }

  async findOne(id: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
    });
    if (!reservation)
      throw new NotFoundException(`Reservation ${id} not found`);
    return reservation;
  }

  update(id: string, dto: UpdateReservationDto) {
    return databaseOperation(() =>
      this.prisma.reservation.update({
        where: { id },
        data: {
          customerId: dto.customerId,
          customerName: dto.customerName,
          reservationDate:
            dto.reservationDate === undefined
              ? undefined
              : new Date(`${dto.reservationDate}T00:00:00.000Z`),
          reservationTime: dto.reservationTime,
          guestCount: dto.guestCount,
          tableNumber: dto.tableNumber,
          status: dto.status,
          specialRequests: dto.specialRequests,
        },
      }),
    );
  }

  remove(id: string) {
    return databaseOperation(() =>
      this.prisma.reservation.delete({ where: { id } }),
    );
  }
}
