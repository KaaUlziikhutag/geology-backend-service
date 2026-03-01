import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional } from 'class-validator';
import { PageOptionsDto } from '../../../../../utils/dto/pageOptions.dto';

export class GetInsuranceTypeDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  code: string;

  @IsString()
  @IsOptional()
  type: string;
}
