import { IsOptional, IsNumber, IsDate, IsString } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateLevelDto {
  @IsOptional()
  @IsNumber()
  authorId: number;

  @IsOptional()
  @IsNumber()
  itemId: number;

  @IsOptional()
  @IsNumber()
  comId: number;

  @IsOptional()
  @IsNumber()
  shiftId: number;

  @IsOptional()
  @IsString()
  note: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date: Date;
}
