import {
  IsOptional,
  IsNumber,
  IsDate,
  IsString,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
export class CreateEthicDto {
  @IsOptional()
  @IsNumber()
  authorId: number;

  @IsOptional()
  @IsNumber()
  workerId: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  misDate: Date;

  @IsOptional()
  @IsString()
  number: string;

  @IsOptional()
  @IsString()
  mistake: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsBoolean()
  type: boolean;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date: Date;
}
