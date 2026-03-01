import { IsString, IsOptional, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateSalaryDto {
  @IsOptional()
  @IsNumber()
  autorId: number;

  @IsOptional()
  @IsNumber()
  comId: number;

  @IsOptional()
  @IsNumber()
  salaryYear: number;

  @IsOptional()
  @IsNumber()
  salaryMonth: number;

  @IsOptional()
  @IsNumber()
  mode: number;

  @IsOptional()
  @IsString()
  fileName: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date: Date;
}
