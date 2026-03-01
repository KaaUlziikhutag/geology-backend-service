import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsNumberString } from 'class-validator';
import { PageOptionsDto } from '../../../../utils/dto/pageOptions.dto';

export class GetTreeDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  short_name: string;

  @IsOptional()
  @IsNumberString()
  type: number;
}
