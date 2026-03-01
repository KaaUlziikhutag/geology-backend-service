import { IsOptional, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateDelayGroupDto {
  @IsOptional()
  @IsNumber()
  itemId: number;

  @IsOptional()
  @IsNumber()
  note: number;

  @IsOptional()
  @IsNumber()
  decisionNum: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fdate: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date: Date;
}
