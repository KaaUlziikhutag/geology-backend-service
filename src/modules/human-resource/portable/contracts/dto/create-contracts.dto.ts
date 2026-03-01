import { IsString, IsOptional, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateContractDto {
  /*Хөдөлмөрийн гэрээ*/
  @IsOptional()
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsString()
  number: string; // Гэрээний дугаар

  @IsOptional()
  @IsString()
  description: string; // Тайлбар

  @IsOptional()
  @IsNumber()
  file?: number; // Хавсаргах файл

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate: Date;
}
