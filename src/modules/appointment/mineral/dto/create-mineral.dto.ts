import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { MineralState } from '../../../../utils/enum-utils.js';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export default class CreateMineralDto {
  @ApiProperty({ description: 'Захиалга ID' })
  @IsOptional()
  @IsNumber()
  appointmentId: number; // Захиалга

  @ApiProperty({ description: 'Нэр' })
  @IsNotEmpty()
  @IsString()
  name: string; // Нэр

  @ApiProperty({ description: 'Дээж төрөл ID' })
  @IsDefined()
  @IsNumber()
  mineralTypeId: number;

  @ApiProperty({ description: 'Жин' })
  @IsDefined()
  @IsNumber()
  weight: number; // Жин

  @ApiPropertyOptional({
    enum: MineralState,
    description: 'Дээж төлөв',
    default: MineralState.pending,
  })
  @IsOptional()
  @IsEnum(MineralState)
  state?: MineralState; // Төлөв
}
