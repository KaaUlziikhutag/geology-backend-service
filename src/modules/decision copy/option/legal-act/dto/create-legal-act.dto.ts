import { IsString, IsOptional, IsNumber } from 'class-validator';
export class CreateLegalActDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  link: string;

  @IsOptional()
  @IsNumber()
  comId: number;

  @IsOptional()
  @IsNumber()
  authorId: number;
}
