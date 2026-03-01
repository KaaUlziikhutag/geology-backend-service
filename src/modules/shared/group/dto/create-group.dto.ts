import { Type } from 'class-transformer';
import { IsString, IsOptional, IsNumber, IsDate } from 'class-validator';
export class CreateGroupDto {
  @IsOptional()
  @IsNumber()
  mid: number; // Root ID

  @IsOptional()
  @IsNumber()
  autorId: number; // Author

  @IsOptional()
  @IsString()
  name: string; // Нэр

  @IsOptional()
  @IsString()
  note: string; // Тэмдэглэл

  @IsOptional()
  @IsNumber()
  pos: number; // Байрлал

  @IsOptional()
  @IsNumber()
  color: number; // Өнгө

  @IsOptional()
  @IsNumber()
  child: number;

  @IsOptional()
  @IsNumber()
  rows: number;

  @IsOptional()
  @IsNumber()
  comId: number; // Байгууллагын ID

  @IsOptional()
  @IsNumber()
  access: number; // Хандалт

  @IsOptional()
  @IsNumber()
  share: number; // Share

  @IsOptional()
  @IsString()
  pro: string; // Програм

  @IsOptional()
  @IsString()
  mod: string; // Модуль

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date: Date; // Системд нэмэгдсэн огноо
}
