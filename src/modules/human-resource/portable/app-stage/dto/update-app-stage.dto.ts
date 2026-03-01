import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateAppStageDto } from './create-app-stage.dto';

export class UpdateAppStageDto extends PartialType(CreateAppStageDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
