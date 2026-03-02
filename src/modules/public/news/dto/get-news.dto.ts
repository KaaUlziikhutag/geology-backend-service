import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsOptional,
  IsDate,
  IsIn,
  IsNumberString,
} from 'class-validator';
import { PageOptionsDto } from '@utils/dto/page-options.dto';
import { Type } from 'class-transformer';

export class GetPublicNewsDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  authorId: number;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate: Date; // Эмчийн ажиллах өдөр

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate: Date; // Эмчийн ажиллах өдөр

  @IsIn(['0', '1'])
  @IsNumberString()
  @IsOptional()
  status: number;
}
