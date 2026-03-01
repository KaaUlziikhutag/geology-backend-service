import { IsString, IsOptional, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateAppStageDto {
  @IsOptional()
  @IsNumber()
  comId: number;

  @IsOptional()
  @IsNumber()
  autorId: number;

  @IsOptional()
  @IsString()
  key: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  pos: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date: Date;
}
