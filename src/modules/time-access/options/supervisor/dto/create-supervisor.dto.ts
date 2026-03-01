import { Type } from 'class-transformer';
import {
  IsOptional,
  IsNumber,
  IsDate,
  IsArray,
  IsBoolean,
} from 'class-validator';

export class CreateSupervisorDto {
  @IsOptional()
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsBoolean()
  isView: boolean;

  @IsOptional()
  @IsBoolean()
  isAdd: boolean;

  @IsOptional()
  @IsBoolean()
  isMode: boolean;

  @IsOptional()
  @IsBoolean()
  isRepSchedule: boolean;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;

  @IsOptional()
  @IsArray()
  workerIds?: number[] = []; // Хамаарах ажилчид
}
