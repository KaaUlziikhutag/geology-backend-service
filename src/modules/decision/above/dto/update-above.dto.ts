import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { CreateAbovetDto } from './create-above.dto';

export class UpdateAboveDto extends PartialType(CreateAbovetDto) {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsBoolean()
  @IsOptional()
  isNotVoid: boolean;
}
