import { IsOptional, IsNumber, IsString, IsEnum } from 'class-validator';
import { Homes, MineType } from '@utils/enum-utils';
export class CreateHomesDto {
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
  @IsEnum(Homes)
  home: Homes;

  @IsOptional()
  @IsEnum(MineType)
  mineType: MineType;

  @IsOptional()
  @IsString()
  additionInfoHome: string;
}
