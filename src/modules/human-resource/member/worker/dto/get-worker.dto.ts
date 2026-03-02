import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsDate } from 'class-validator';
import { PageOptionsDto } from '@utils/dto/page-options.dto';
import { Type } from 'class-transformer';

export class GetWorkerDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  dbKey: string;

  @IsString()
  @IsOptional()
  server: string;

  @IsString()
  @IsOptional()
  filter: string;

  @IsString()
  @IsOptional()
  isActive: number;

  @IsString()
  @IsOptional()
  comName: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate: Date;
}
