import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export default class CreateCategoryDto {
  @ApiProperty()
  @IsNumber()
  iconId: number;

  @ApiProperty()
  @IsNumber()
  imageId: number;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isFeature: boolean;
}
