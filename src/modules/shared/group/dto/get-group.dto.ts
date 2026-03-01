import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional } from 'class-validator';
import { PageOptionsDto } from '../../../../utils/dto/pageOptions.dto';

export class GetGroupDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  note: string;

  @IsString()
  @IsOptional()
  pro: string;
}
