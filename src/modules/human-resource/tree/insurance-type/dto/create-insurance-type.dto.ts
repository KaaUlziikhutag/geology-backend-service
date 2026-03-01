import { IsString, IsOptional } from 'class-validator';

export class CreateInsuranceTypeDto {
  @IsOptional()
  @IsString()
  code: string; // ДААТГУУЛАГЧИЙН ТӨРЛИЙН КОД

  @IsOptional()
  @IsString()
  type: string; // ДААТГУУЛАГ-ЧИЙН ТӨРӨЛ
}
