import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsDate, IsNumberString } from 'class-validator';
import { PageOptionsDto } from '../../../../utils/dto/pageOptions.dto';
import { Type } from 'class-transformer';

export class GetTimeRequestDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  userId: number;

  @IsString()
  @IsOptional()
  timeStateId: number;

  @IsString()
  @IsOptional()
  treeId: number;

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
  type: number;
}
