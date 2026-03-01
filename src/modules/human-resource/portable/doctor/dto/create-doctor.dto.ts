import { IsString, IsOptional, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDoctorDto {
  @IsOptional()
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsNumber()
  authorId: number;

  @IsOptional()
  @IsString()
  info: string; // Бусад тайлбар

  @IsOptional()
  @IsString()
  inspectionName: string; // Үзлэгийн нэр

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date: Date; // Үзлэгт орсон огноо

  @IsOptional()
  @IsNumber()
  isDoctor: number; // Эмчлүүлэх шаардлагтай эсэх
}
