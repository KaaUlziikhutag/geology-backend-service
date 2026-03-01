import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional } from 'class-validator';
import { PageOptionsDto } from '../../../../utils/dto/pageOptions.dto';

export class GetPagesDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  mod: string;

  @IsString()
  @IsOptional()
  pro: string;
}
