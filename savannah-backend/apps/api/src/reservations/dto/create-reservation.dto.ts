import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsDateString,
  Matches,
  ValidateIf,
} from 'class-validator';
import { ReservationStatus } from '../../../generated/prisma/enums';

export class CreateReservationDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  customerId?: string | null;

  @IsString()
  @IsNotEmpty()
  customerName!: string;

  @IsDateString({ strict: true })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  reservationDate!: string;

  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  reservationTime!: string;

  @IsInt()
  @Min(1)
  @Max(2147483647)
  guestCount!: number;

  @IsString()
  @IsNotEmpty()
  tableNumber!: string;

  @ValidateIf((_object, value) => value !== undefined)
  @IsEnum(ReservationStatus)
  status?: ReservationStatus;

  @ValidateIf((_object, value) => value !== undefined)
  @IsString()
  specialRequests?: string;
}
