import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional } from 'class-validator';
import { PageOptionsDto } from '../../../../../utils/dto/pageOptions.dto';

export class GetDelayGroupDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  itemId: number;

  @IsString()
  @IsOptional()
  note: number;
}
