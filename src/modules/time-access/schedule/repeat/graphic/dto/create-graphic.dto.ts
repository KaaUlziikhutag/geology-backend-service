import { IsOptional, IsNumber, IsString } from 'class-validator';
import RepeatStep from '../entity/step.entity';

export class CreateGraphicDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  position: number;

  @IsOptional()
  steps: RepeatStep[];
}
