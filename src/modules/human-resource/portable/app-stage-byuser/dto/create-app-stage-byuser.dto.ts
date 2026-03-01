import {
  IsString,
  IsOptional,
  IsNumber,
  IsDate,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
export class CreateAppStageByUserDto {
  @IsOptional()
  @IsNumber()
  autorId: number;

  @IsOptional()
  @IsNumber()
  appId: number;

  @IsOptional()
  @IsNumber()
  stageId: number;

  @IsOptional()
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date: Date;
}
