import { TimeCelebratoryType } from '../../../../../utils/globalUtils';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDate,
  IsEnum,
  IsString,
} from 'class-validator';
export class CreateCelebratoryDto {
  @IsOptional()
  @IsNumber()
  comId: number;

  @IsOptional()
  @IsBoolean()
  isCelebratory?: boolean;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsOptional()
  @IsEnum(TimeCelebratoryType)
  type: TimeCelebratoryType;

  @IsOptional()
  @IsString()
  name: string;

  // @IsOptional()
  // @IsEnum(StartMonth)
  // startMonth: StartMonth;

  // @IsOptional()
  // @IsNumber()
  // startDay: number;

  @IsOptional()
  @IsNumber()
  duration: number;
}
