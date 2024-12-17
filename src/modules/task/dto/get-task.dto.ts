import {
  IsArray,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { MineralState, TaskState } from '../../../utils/enum-utils.js';
import { PageOptionsDto } from '../../../utils/dto/page-options.dto.js';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetTaskDto extends PageOptionsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  barcode: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(TaskState)
  state: TaskState;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  laboratoryId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  userId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsEnum(MineralState, { each: true })
  mineralStates: MineralState[];
}
