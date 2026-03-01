import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
export class CreateCompanyDto {
  @IsOptional()
  @IsNumber()
  itemId: number;

  @IsOptional()
  @IsString()
  pro: string;

  @IsOptional()
  @IsNumber()
  comId: number;

  @IsOptional()
  @IsBoolean()
  isAllow: boolean;
}
