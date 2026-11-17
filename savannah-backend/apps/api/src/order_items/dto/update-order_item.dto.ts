import { IsInt, Min, Max, ValidateIf } from 'class-validator';

export class UpdateOrderItemDto {
  @ValidateIf((_object, value) => value !== undefined)
  @IsInt()
  @Min(1)
  @Max(2147483647)
  quantity?: number;
}
