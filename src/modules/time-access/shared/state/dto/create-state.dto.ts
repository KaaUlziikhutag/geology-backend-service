import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
export class CreateStateDto {
  @IsOptional()
  @IsNumber()
  requestId: number;

  @IsOptional()
  @IsString()
  note: string;

  @IsOptional()
  @IsBoolean()
  isSalary: boolean;

  @IsOptional()
  @IsNumber()
  skipWeekend: number;
}
