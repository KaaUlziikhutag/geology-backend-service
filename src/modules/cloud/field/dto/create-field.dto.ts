import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
export class CreateFieldDto {
  @IsOptional()
  @IsNumber()
  workerId: number;

  @IsOptional()
  @IsString()
  program: string;

  @IsOptional()
  @IsString()
  module: string;

  @IsOptional()
  @IsString()
  field: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsBoolean()
  isShow: boolean;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsNumber()
  pos: number;
}
