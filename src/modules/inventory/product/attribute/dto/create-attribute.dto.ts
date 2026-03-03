import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

export default class CreateAttributeDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Comma separated values',
    example: 'red,green,blue',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return value.split(',').map((v: string) => v.trim());
  })
  values: string[];
}
