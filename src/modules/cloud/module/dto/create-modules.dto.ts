import { AccessType } from '@utils/enum-utils';
import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
export class CreateModuleDto {
  @IsOptional()
  @IsString()
  key: string;

  @IsOptional()
  @IsNumber()
  proId: number;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  comment: string;

  @IsOptional()
  @IsNumber()
  pos: number;

  @IsOptional()
  @IsEnum(AccessType)
  access: AccessType;
}
