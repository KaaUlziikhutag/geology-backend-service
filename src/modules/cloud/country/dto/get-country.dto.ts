import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsNumberString, IsArray } from 'class-validator';
import { PageOptionsDto } from '../../../../utils/dto/pageOptions.dto';

export class GetCountryDto extends PartialType(PageOptionsDto) {
  @IsOptional()
  @IsArray()
  @IsNumberString({}, { each: true })
  ids?: number[];

  @IsString()
  @IsOptional()
  parentId?: number;

  @IsString()
  @IsOptional()
  position?: number;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  type?: string;
}
