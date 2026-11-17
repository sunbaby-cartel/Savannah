import { IsString, IsNotEmpty, IsInt, Min, Max } from 'class-validator';

export class CreateOrderItemDto {
  @IsString()
  @IsNotEmpty()
  orderId!: string;

  @IsString()
  @IsNotEmpty()
  menuItemId!: string;

  @IsInt()
  @Min(1)
  @Max(2147483647)
  quantity!: number;
}
