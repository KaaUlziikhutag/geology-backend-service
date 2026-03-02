import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { Level, Levels } from '@utils/enum-utils';
export class CreateLanguageDto {
  // Гадаад хэлний мэдлэг
  @IsOptional()
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsNumber()
  authorId: number;

  @IsOptional()
  @IsNumber()
  name: string; // Эзэмшсэн хэл

  @IsOptional()
  @IsString()
  exam: string; // Стандарт шалгалт

  @IsOptional()
  @IsString()
  score: string; // Оноо

  @IsOptional()
  @IsEnum(Levels)
  level: Levels; // Түвшин

  @IsOptional()
  @IsEnum(Level)
  speak: Level; // Ярих чадвар

  @IsOptional()
  @IsEnum(Level)
  read: Level; // Унших чадвар

  @IsOptional()
  @IsEnum(Level)
  write: Level; // Бичих чадвар

  @IsOptional()
  @IsEnum(Level)
  listen: Level; // Сонсох чадвар

  @IsOptional()
  @IsString()
  note: string; // Тайлбар
}
