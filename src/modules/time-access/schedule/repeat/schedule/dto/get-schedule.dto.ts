import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional } from 'class-validator';
import { PageOptionsDto } from '@utils/dto/page-options.dto';

export class GetRepeatScheduleDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  repeatId: number;

  @IsString()
  @IsOptional()
  directId: number;
}
