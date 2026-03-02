import { IsEnum, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { LevelType } from '@utils/enum-utils';
import { Type } from 'class-transformer';
export class CreateItechItemDto {
  @IsOptional()
  @IsNumber()
  userId: number; // worker Id

  @IsOptional()
  @IsNumber()
  itechId: number; // itechs Id

  @IsOptional()
  @IsEnum(LevelType)
  value?: LevelType;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateItechItemDto)
  itechItems: CreateItechItemDto[]; //
}
