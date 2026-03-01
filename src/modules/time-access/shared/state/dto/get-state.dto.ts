import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional } from 'class-validator';
import { PageOptionsDto } from '../../../../../utils/dto/pageOptions.dto';

export class GetStateDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  requestId: number;
}
