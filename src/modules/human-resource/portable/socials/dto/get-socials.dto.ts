import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsNumberString } from 'class-validator';
import { PageOptionsDto } from '../../../../../utils/dto/pageOptions.dto';

export class GetSocialsDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  authorId: number;

  @IsString()
  @IsOptional()
  userId: number;

  @IsOptional()
  @IsNumberString()
  unit: number;
}
