import { PartialType } from '@nestjs/mapped-types';
import CreateAppointmentDto from './create-appointment.dto';
import { IsNumber, IsOptional } from 'class-validator';

export default class UpdateAppointmentDto extends PartialType(
  CreateAppointmentDto,
) {
  @IsNumber()
  @IsOptional()
  id: number;
}
