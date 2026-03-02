import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional } from 'class-validator';
import { PageOptionsDto } from '@utils/dto/page-options.dto';

export class GetAccessDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  workerId: number;

  @IsString()
  @IsOptional()
  proId: number;
}
