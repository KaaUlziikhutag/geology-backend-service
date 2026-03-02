import { AccessType } from '@utils/enum-utils';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
} from 'class-validator';
export class CreateProgramDto {
  @IsOptional()
  @IsString()
  keyword: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  intro: string;

  @IsOptional()
  @IsNumber()
  pos: number;

  @IsOptional()
  @IsNumber()
  type: number;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsBoolean()
  isMobile: boolean;

  @IsOptional()
  @IsEnum(AccessType)
  access: AccessType;
}
