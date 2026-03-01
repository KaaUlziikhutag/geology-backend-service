import { IsString, IsOptional, IsNumber } from 'class-validator';
export class CreatePagesDto {
  // хүний нөөц ажилан
  @IsOptional()
  @IsString()
  pro: string; // Програм program_I name

  @IsOptional()
  @IsString()
  mod: string; // Модуль modules_i name

  @IsOptional()
  @IsString()
  tab: string; // Tab хувтйн ажилын

  @IsOptional()
  @IsString()
  key: string; // Key

  @IsOptional()
  @IsString()
  name: string; // нэмэлт мэдээлэл гэр бүл, ажлын туршлага

  @IsOptional()
  @IsString()
  search: string; // Хайлт

  @IsOptional()
  @IsNumber()
  pos: number; // Байрлал
}
