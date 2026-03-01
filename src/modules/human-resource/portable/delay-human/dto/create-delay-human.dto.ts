import {
  IsOptional,
  IsNumber,
  IsDate,
  IsString,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
export class CreateDelayHumanDto {
  @IsOptional()
  @IsNumber()
  itemId: number;

  @IsOptional()
  @IsNumber()
  comId: number;

  @IsOptional()
  @IsNumber()
  receiverId: number;

  @IsOptional()
  @IsNumber()
  senderId: number;

  @IsOptional()
  @IsNumber()
  authorId: number;

  @IsOptional()
  @IsString()
  rule: string;

  @IsOptional()
  @IsBoolean()
  isStart: boolean;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  shiftDate: Date;

  @IsOptional()
  @IsNumber()
  confirmId: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  confirmDate: Date;
}
