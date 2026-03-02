import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsNumberString,
} from 'class-validator';
import { PageOptionsDto } from '@utils/dto/page-options.dto';

export class GetTypeDto extends PartialType(PageOptionsDto) {
  @IsOptional()
  @IsBoolean()
  isCat: boolean;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  note: string;

  @IsOptional()
  @IsNumber()
  parentId: number;

  @IsOptional()
  @IsNumberString()
  contractType: number;
}
