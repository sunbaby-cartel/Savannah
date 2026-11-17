import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsEnum,
  IsArray,
  ValidateIf,
} from 'class-validator';
import { CustomerStatus } from '../../../generated/prisma/enums';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ValidateIf((_object, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  customerNumber?: string;

  @ValidateIf((_object, value) => value !== undefined)
  @IsEnum(CustomerStatus)
  status?: CustomerStatus;

  @ValidateIf((_object, value) => value !== undefined)
  @IsArray()
  @IsString({ each: true })
  dietaryPreferences?: string[];

  @ValidateIf((_object, value) => value !== undefined)
  @IsString()
  notes?: string;
}
