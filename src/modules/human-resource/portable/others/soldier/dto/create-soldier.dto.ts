import { IsOptional, IsNumber, IsDate, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSoldiersDto {
  @IsOptional()
  @IsNumber()
  authorId: number;

  @IsOptional()
  @IsNumber()
  workerId: number;

  @IsOptional()
  @IsNumber()
  comId: number;

  @IsOptional()
  @IsNumber()
  isSolder: number;

  @IsOptional()
  @IsString()
  classNum: string;

  @IsOptional()
  @IsString()
  number: string;

  @IsOptional()
  @IsString()
  soldierAppName: string;

  @IsOptional()
  @IsString()
  occupation: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsOptional()
  @IsString()
  additionInfo: string;
}
