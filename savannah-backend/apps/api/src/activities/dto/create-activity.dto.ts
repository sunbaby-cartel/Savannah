import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ActivityType } from '../../../generated/prisma/enums';

export class CreateActivityDto {
  @IsEnum(ActivityType)
  type!: ActivityType;

  @IsString()
  @IsNotEmpty()
  message!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  entityId?: string | null;
}
