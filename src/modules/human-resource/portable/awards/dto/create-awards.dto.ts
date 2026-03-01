import { IsString, IsOptional, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateAwardDto {
  // Шагнал урамшуулал
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsNumber()
  authorId?: number;

  @IsOptional()
  @IsString()
  awardName: string; // Шагналын нэр

  @IsOptional()
  @IsString()
  bonus?: string; // Шагнасан байгууллага

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date; // Шагнуулсан огноо

  @IsOptional()
  @IsString()
  reason?: string; // Шагнагдсан шалтгаан

  @IsOptional()
  @IsString()
  sName: string; // Шийдвэрийн нэр
}
