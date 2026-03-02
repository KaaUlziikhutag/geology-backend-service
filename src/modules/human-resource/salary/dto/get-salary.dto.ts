import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional } from 'class-validator';
import { PageOptionsDto } from '@utils/dto/page-options.dto';

export class GetSalaryDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  autorId: number;

  @IsString()
  @IsOptional()
  comId: number;
}
