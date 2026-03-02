import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsDate, IsNumberString } from 'class-validator';
import { PageOptionsDto } from '@utils/dto/page-options.dto';
import { Type } from 'class-transformer';

export class GetHolidayDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  authorId: number;

  @IsString()
  @IsOptional()
  holderId: number;

  @IsString()
  @IsOptional()
  appId: number;

  @IsString()
  @IsOptional()
  itemId: number;

  @IsString()
  @IsOptional()
  depId: number;

  @IsString()
  @IsOptional()
  groupId: number;

  @IsString()
  @IsOptional()
  workerId: number;

  @IsOptional()
  @IsNumberString()
  holidayType: number;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate: Date;

  @IsNumberString()
  @IsOptional()
  type: number;

  @IsNumberString()
  @IsOptional()
  accessType: number;

  @IsOptional()
  @IsString()
  ids: string;
}
