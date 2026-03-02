import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsNumberString, IsDate } from 'class-validator';
import { PageOptionsDto } from '../../../../../utils/dto/page-options.dto';
import { Type } from 'class-transformer';

export class GetTimeStateDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  comId: number;

  @IsOptional()
  @IsNumberString()
  type: number;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate: Date;
}
