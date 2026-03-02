import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { TimePeriod } from '@utils/enum-utils';

export class HierarchyDto {
  @IsOptional()
  @IsNumber()
  treeId?: number; // шатлал 1 албан тушаал

  @IsOptional()
  @IsEnum(TimePeriod)
  type: TimePeriod;

  @IsOptional()
  @IsString()
  times: string; // 20 удаагаар

  @IsOptional()
  @IsNumber()
  dayAndHour?: number; // Хоног болон цаг
}
