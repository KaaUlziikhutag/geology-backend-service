import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateAppStageByUserDto } from './create-app-stage-byuser.dto';

export class UpdateAppStageByUserDto extends PartialType(
  CreateAppStageByUserDto,
) {
  @IsNumber()
  @IsOptional()
  id: number;
}
