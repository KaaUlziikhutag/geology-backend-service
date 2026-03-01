import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional } from 'class-validator';
import { PageOptionsDto } from '../../../../../../utils/dto/pageOptions.dto';

export class GetRepeatDetailDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  repeatId: number;
}
