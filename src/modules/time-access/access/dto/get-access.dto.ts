import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsDate, IsNumberString } from 'class-validator';
import { PageOptionsDto } from '@utils/dto/page-options.dto';
import { Type } from 'class-transformer';

export class GetAccessDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  userId: number;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  date: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate: Date;

  @IsOptional()
  @IsNumberString()
  scheduleStatus: number; // Төрөл
}
