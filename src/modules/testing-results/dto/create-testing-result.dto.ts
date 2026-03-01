import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, ValidateNested } from 'class-validator';
import { CreateResultIndicatorDto } from './create-result-indicator.dto';

export class CreateTestingResultDto {
  @ApiProperty()
  @IsNumber()
  taskId: number;

  @ApiProperty({ isArray: true, type: CreateResultIndicatorDto })
  @ValidateNested({ each: true })
  @Type(() => CreateResultIndicatorDto)
  resultIndicators: CreateResultIndicatorDto[];
}
