import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
export class CreateMainScheduleDto {
  @IsOptional()
  @IsNumber()
  directId: number;

  @IsOptional()
  @IsNumber()
  graphicId: number;

  @IsOptional()
  @IsString()
  day: string;

  @IsOptional()
  @IsString()
  time1: string;

  @IsOptional()
  @IsString()
  time4: string;

  @IsOptional()
  @IsString()
  time5: string;

  @IsOptional()
  @IsString()
  limitTimeStart: string;

  @IsOptional()
  @IsString()
  limitTimeEnd: string;

  @IsOptional()
  @IsBoolean()
  isTimeLimit?: boolean;

  @IsOptional()
  @IsNumber()
  isRestday?: number;
}
