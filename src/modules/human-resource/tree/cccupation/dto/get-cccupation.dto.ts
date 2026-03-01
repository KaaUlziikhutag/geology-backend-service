import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsNumberString } from 'class-validator';
import { PageOptionsDto } from '../../../../../utils/dto/pageOptions.dto';

export class GetOccupationDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  code: string;

  @IsString()
  @IsOptional()
  filter: string;

  @IsOptional()
  @IsNumberString()
  type: number;

  @IsOptional()
  @IsNumberString()
  mid: number;
}
