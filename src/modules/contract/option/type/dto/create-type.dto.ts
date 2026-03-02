import { ContractType } from '@utils/enum-utils';
import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
export class CreateTypeDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  note: string;

  @IsOptional()
  @IsString()
  code: string;

  @IsOptional()
  @IsNumber()
  authorId: number;

  @IsOptional()
  @IsNumber()
  comId: number;

  @IsOptional()
  @IsEnum(ContractType)
  contractType: ContractType;
}
