import { IsOptional, IsNumber, IsBoolean } from 'class-validator';
export class CreateNewsLikeDto {
  @IsOptional()
  @IsNumber()
  newsId: number;

  @IsOptional()
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsBoolean()
  isLiked: boolean;
}
