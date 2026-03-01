import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateRepeatScheduleDto } from './create-schedule.dto';

export class UpdateRepeatScheduleDto extends PartialType(
  CreateRepeatScheduleDto,
) {
  @IsNumber()
  @IsOptional()
  id: number;
}
