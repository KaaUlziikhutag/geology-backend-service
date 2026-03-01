import { IsString, IsOptional, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateInnerTrainingDto {
  // Хамрагдсан сургалт
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsNumber()
  authorId?: number;

  @IsOptional()
  @IsString()
  name: string; // Сургалтын нэр

  @IsOptional()
  @IsString()
  coveredForm: string; // Хамрагдсан хэлбэр

  @IsOptional()
  @IsString()
  course: string; // Сургалтын чиглэл

  @IsOptional()
  @IsString()
  organiser: string; // Зохион байгуулагч нэр

  @IsOptional()
  @IsNumber()
  depId?: number; // Хамрагдсан алба хэлтэс

  @IsOptional()
  @IsNumber()
  appId?: number; // Хамрагдсан алба хэлтэс

  @IsOptional()
  @IsString()
  depName?: string; // Хамрагдсан алба хэлтэс нэр

  @IsOptional()
  @IsString()
  appName?: string; // Хамрагдсан алба хэлтэс нэр

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate: Date; // Хамрагдсан он

  @IsOptional()
  @IsNumber()
  continuedTime?: number; // Үргэлжилсэн хуцгаа
}
