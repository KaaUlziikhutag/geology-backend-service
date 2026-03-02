import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional } from 'class-validator';
import { PageOptionsDto } from '@utils/dto/page-options.dto';

export class GetAccessDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  itemId: number;

  @IsString()
  @IsOptional()
  userId: number;

  @IsString()
  @IsOptional()
  proId: number;
}
