import { IsString, IsOptional, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateVacationDto {
  // Ээлжийн амралт
  @IsOptional()
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsNumber()
  autorId: number;

  @IsOptional()
  @IsString()
  number: string; // Тушаалын дугаар

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate: Date; // Эхэлсэн

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate: Date; // Дууссан

  @IsOptional()
  @IsString()
  comment: string; // тайлбар

  @IsOptional()
  @IsNumber()
  duration: number; // Амралтын хоног
}
