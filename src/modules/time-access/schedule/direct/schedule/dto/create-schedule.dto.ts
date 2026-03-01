import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDate,
} from 'class-validator';
export class CreateDirectScheduleDto {
  @IsOptional()
  @IsNumber()
  directId: number;

  @IsOptional()
  @IsNumber()
  autorId?: number;

  @IsOptional()
  @IsNumber()
  day?: number;

  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;

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
  @IsBoolean()
  fn?: boolean;

  @IsOptional()
  @IsBoolean()
  isHoliday?: boolean;

  @IsOptional()
  @IsBoolean()
  isRestday?: boolean;

  @IsOptional()
  @IsBoolean()
  isWork?: boolean;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;
}
