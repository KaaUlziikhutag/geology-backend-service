import { PartialType } from '@nestjs/mapped-types';
import CreateAppointmentDto from './create-appointment.dto.js';
import { IsNumber, IsOptional } from 'class-validator';

export default class UpdateAppointmentDto extends PartialType(
  CreateAppointmentDto,
) {
  @IsNumber()
  @IsOptional()
  id: number;
}
