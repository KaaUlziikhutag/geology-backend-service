import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateOptionDto {
  @IsOptional()
  @IsNumber()
  comId: number;

  @IsOptional()
  @IsString()
  module: string;

  @IsOptional()
  @IsBoolean()
  isBirthDayMail: boolean;

  @IsOptional()
  @IsBoolean()
  isOwnModerator: boolean;

  @IsOptional()
  @IsBoolean()
  isDoubleCode: boolean;

  @IsOptional()
  @IsBoolean()
  isHideSubComs: boolean;

  @IsOptional()
  @IsBoolean()
  isAwardShow: boolean;
}
