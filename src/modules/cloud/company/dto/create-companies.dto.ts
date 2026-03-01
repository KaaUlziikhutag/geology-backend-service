import { Type } from 'class-transformer';
import { IsString, IsOptional, IsNumber, IsDate } from 'class-validator';
export class CreateCompaniesDto {
  @IsOptional()
  @IsString()
  dbKey: string;

  @IsOptional()
  @IsString()
  name: string; // Компаний нэр

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  licenseDate: Date; // Систем ашиглах хугацаа

  @IsOptional()
  @IsString()
  dataBase: string; // Датабааз

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  attentDate: Date; // Анхааруулах хугацаа

  @IsOptional()
  @IsNumber()
  userCnt: number; // Хэрэглэгчийн тоо

  @IsOptional()
  @IsString()
  dataHost: string; // data url

  @IsOptional()
  @IsString()
  dataDir: string; // data хавтас

  @IsOptional()
  @IsString()
  register: string; // Регистерийн дугаар

  @IsOptional()
  @IsString()
  gmail: string; // Имэйл

  @IsOptional()
  @IsNumber()
  number: number; // Улсын бүртгэлийн дугаар
}
