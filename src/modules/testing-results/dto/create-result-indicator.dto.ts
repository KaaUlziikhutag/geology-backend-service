import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class CreateResultIndicatorDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  resultId: number;

  @ApiProperty()
  @IsNumber()
  indicatorId: number;

  @ApiProperty()
  @IsNumber()
  value: number;
}
