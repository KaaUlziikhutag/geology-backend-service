import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional } from 'class-validator';
import { PageOptionsDto } from '../../../../../utils/dto/pageOptions.dto';

export class GetVacationDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  autorId: number;

  @IsString()
  @IsOptional()
  userId: number;
}
