import {
  IsBoolean,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export default class CreateAppointmentDto {
  @IsDefined()
  @IsNumber()
  customerId: number;

  @IsOptional()
  @IsNumber()
  warehouseId: number;

  @IsOptional()
  @IsBoolean()
  isDuplicate: boolean;

  @IsOptional()
  @IsBoolean()
  isAnalytic: boolean;

  @IsOptional()
  @IsString()
  delivered: string;

  @IsOptional()
  @IsOptional()
  received: string;

  @IsOptional()
  @IsString()
  description: string;
}
