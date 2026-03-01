import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateDirectScheduleDto } from './create-schedule.dto';

export class UpdateDirectScheduleDto extends PartialType(
  CreateDirectScheduleDto,
) {
  @IsNumber()
  @IsOptional()
  id: number;
}
