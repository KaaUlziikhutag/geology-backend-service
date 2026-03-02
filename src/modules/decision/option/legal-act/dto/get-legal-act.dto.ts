import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional } from 'class-validator';
import { PageOptionsDto } from '@utils/dto/page-options.dto';

export class GetLegalActDto extends PartialType(PageOptionsDto) {
  @IsOptional()
  @IsString()
  name: string;
}
