import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  Min,
  Max,
  IsNumber,
  ValidateIf,
} from 'class-validator';
import { OrderType, OrderStatus } from '../../../generated/prisma/enums';

export class CreateOrderDto {
  @ValidateIf((_object, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  orderNumber?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  customerId?: string | null;

  @IsString()
  @IsNotEmpty()
  customerName!: string;

  @IsEnum(OrderType)
  orderType!: OrderType;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  tableNumber?: string | null;

  @ValidateIf((_object, value) => value !== undefined)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(99999999.99)
  tax?: number;

  @ValidateIf((_object, value) => value !== undefined)
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ValidateIf((_object, value) => value !== undefined)
  @IsString()
  notes?: string;
}
