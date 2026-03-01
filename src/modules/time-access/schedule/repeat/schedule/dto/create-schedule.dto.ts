import { Type } from 'class-transformer';
import { IsOptional, IsNumber, IsDate, IsString } from 'class-validator';
export class CreateRepeatScheduleDto {
  @IsOptional()
  @IsNumber()
  repeatId?: number;

  @IsOptional()
  @IsNumber()
  stepId?: number;

  @IsOptional()
  @IsNumber()
  graphicId?: number;

  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsString()
  time1?: string;

  @IsOptional()
  @IsString()
  time2?: string;

  @IsOptional()
  @IsString()
  time3?: string;

  @IsOptional()
  @IsString()
  time4?: string;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;
}
