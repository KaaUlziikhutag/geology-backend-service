import { IsString, IsOptional, IsNumber } from 'class-validator';
export class CreateDirectLostDto {
  @IsOptional()
  @IsNumber()
  directId: number;

  @IsOptional()
  @IsString()
  day: string;

  @IsOptional()
  @IsString()
  startTime: string;

  @IsOptional()
  @IsString()
  endTime: string;

  @IsOptional()
  @IsNumber()
  money: number;
}
