import { Type } from 'class-transformer';
import { RequestType, TimePeriod } from '../../../../../utils/globalUtils';
import {
  IsOptional,
  IsNumber,
  IsEnum,
  IsString,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { HierarchyDto } from './hierarchy.dto';
export class CreateTimeStateDto {
  @IsOptional()
  @IsNumber()
  comId: number;

  @IsOptional()
  @IsEnum(RequestType)
  type: RequestType;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  color: string;

  @IsOptional()
  @IsBoolean()
  isWork?: boolean;

  @IsOptional()
  @IsBoolean()
  isFile?: boolean;

  @IsOptional()
  @IsBoolean()
  limitMonth?: boolean;

  @IsOptional()
  @IsString()
  limitHours1: string;

  @IsOptional()
  @IsNumber()
  limitType1: number;

  @IsOptional()
  @IsBoolean()
  isReceivingRequests?: boolean;

  @IsOptional()
  @IsNumber()
  deadline: number;

  @IsOptional()
  @IsBoolean()
  isSetRequestLimit?: boolean;

  @IsOptional()
  @IsBoolean()
  isShowingExcess?: boolean;

  @IsOptional()
  @IsString()
  limitHours2: string;

  @IsOptional()
  @IsNumber()
  limitType2: number;

  @IsOptional()
  @IsEnum(TimePeriod)
  frequency: TimePeriod;

  @IsOptional()
  @IsBoolean()
  isEnterPermissionHierarchy?: boolean;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => HierarchyDto)
  hierarchy: HierarchyDto[];

  @IsOptional()
  @IsBoolean()
  isTimeAndDayLimits?: boolean;

  @IsOptional()
  @IsBoolean()
  isWorkVacation?: boolean;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => HierarchyDto)
  vacation: HierarchyDto[];
}
