import { IsOptional, IsNumber } from 'class-validator';
export class CreateUserViewDto {
  @IsOptional()
  @IsNumber()
  newsId: number;

  @IsOptional()
  @IsNumber()
  userId: number;
}
