import { IsString, IsOptional, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateAptitudeDto {
  // Урлага спортын авьяас
  @IsOptional()
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsNumber()
  authorId: number;

  @IsOptional()
  @IsString()
  sName: string; // Хичээллэдэг урлаг, спорт

  @IsOptional()
  @IsNumber()
  sYear: number; // Хичээллэсэн жил

  @IsOptional()
  @IsString()
  level: string; // Зэрэг цол

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date: Date; // Огноо
}
