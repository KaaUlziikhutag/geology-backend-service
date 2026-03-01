import { IsString, IsOptional, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateAppTypeDto {
  @IsOptional()
  @IsNumber()
  comId: number;

  @IsOptional()
  @IsNumber()
  autorId: number;

  @IsOptional()
  @IsString()
  note: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  yearsPrivate: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date: Date;
}
