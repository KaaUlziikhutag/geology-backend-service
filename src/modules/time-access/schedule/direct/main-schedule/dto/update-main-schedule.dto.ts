import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateMainScheduleDto } from './create-main-schedule.dto';

export class UpdateMainScheduleDto extends PartialType(CreateMainScheduleDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
