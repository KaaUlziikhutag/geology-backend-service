import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsOptional,
  IsDate,
  IsNumberString,
  IsBooleanString,
} from 'class-validator';
import { PageOptionsDto } from '../../../utils/dto/pageOptions.dto';
import { Type } from 'class-transformer';

export class GetDashboardDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  gender: string;

  @IsString()
  @IsOptional()
  year: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate: Date;

  @IsString()
  @IsOptional()
  maritalStatus: string;

  @IsString()
  @IsOptional()
  workerType: string;

  @IsString()
  @IsOptional()
  employeeType: string;

  @IsString()
  @IsOptional()
  typeOfPosition: string;

  @IsOptional()
  @IsNumberString()
  treeId: number;

  @IsOptional()
  @IsNumberString()
  depId: number;

  @IsString()
  @IsOptional()
  temporaryOptions: string;

  @IsOptional()
  @IsBooleanString()
  isSchedule: boolean;

  @IsOptional()
  @IsBooleanString()
  isWarranty: boolean;

  @IsOptional()
  @IsBooleanString()
  isCertificate: boolean;

  @IsOptional()
  @IsBooleanString()
  isUniqueValue: boolean;

  @IsOptional()
  @IsNumberString()
  typeId: number;

  @IsString()
  @IsOptional()
  index: string;
}
