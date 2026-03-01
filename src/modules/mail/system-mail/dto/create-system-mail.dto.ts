import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsBoolean,
} from 'class-validator';
export class CreateSystemMailDto {
  @IsOptional()
  @IsString()
  subject: string;

  @IsOptional()
  @IsString()
  letter: string;

  @IsOptional()
  @IsNumber()
  mailType: number;

  @IsOptional()
  @IsDateString()
  date: Date; //

  @IsOptional()
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsBoolean()
  isNew: boolean;

  @IsOptional()
  @IsNumber()
  groupId: number;

  @IsOptional()
  @IsBoolean()
  isStarred: boolean;

  @IsOptional()
  @IsBoolean()
  isFired: boolean;

  @IsOptional()
  @IsString()
  prod: string;

  @IsOptional()
  @IsString()
  mode: string;

  @IsOptional()
  @IsString()
  itemId: string;

  @IsOptional()
  @IsString()
  msgId: string;
}
