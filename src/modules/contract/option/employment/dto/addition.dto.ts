import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ContactFormat } from '@utils/enum-utils';

export class AdditionDto {
  @IsOptional()
  @IsString()
  additionValue: string; // Нэмэгдлийн утга

  @IsOptional()
  @IsNumber()
  score: number; // Дүн

  @IsOptional()
  @IsString()
  calculatedSalary: string; // Тооцох цалин

  @IsOptional()
  @IsEnum(ContactFormat)
  shape: ContactFormat; // Хэлбэр
}

export class ShboDto {
  @IsOptional()
  @IsString()
  shboValue: string; // Нэмэгдлийн утга

  @IsOptional()
  @IsNumber()
  amount: number; //  Төлөх дүн

  @IsOptional()
  @IsString()
  calculatedSalary: string; // Тооцох цалин

  @IsOptional()
  @IsEnum(ContactFormat)
  shape: ContactFormat; // Хэлбэр
}
