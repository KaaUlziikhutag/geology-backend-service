import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { CustomerType } from '../../../utils/enum-utils';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateCustomerDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  directionId: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  sectionId: number;

  @ApiProperty()
  @IsDefined()
  @IsEnum(CustomerType)
  type: CustomerType;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  regno: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  addName: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  phone: string;

  @ApiProperty()
  @IsOptional()
  @IsNumberString()
  addPhone: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  provinceId: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  districtId: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  address: string;
}
