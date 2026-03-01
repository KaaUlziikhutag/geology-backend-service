import { IsOptional, IsNumber, IsString } from 'class-validator';
export class CreateCommentDto {
  @IsOptional()
  @IsNumber()
  newsId: number;

  @IsOptional()
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsString()
  content: string;
}
