import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsDate } from 'class-validator';
import { PageOptionsDto } from '../../../../../utils/dto/pageOptions.dto';
import { Type } from 'class-transformer';

export class GetCelebratoryDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  comId: number;

  @IsOptional()
  @IsString()
  search: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  currentAt: Date;
}
