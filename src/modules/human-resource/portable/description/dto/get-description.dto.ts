import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsNumberString } from 'class-validator';
import { PageOptionsDto } from '@utils/dto/page-options.dto';

export class GetDescriptionDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  authorId: number;

  @IsString()
  @IsOptional()
  userId: number;

  @IsOptional()
  @IsNumberString()
  appId: number;
}
