import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateAppointmentDto } from './create-appointment.dto';
import AppointmentShifts from '../entities/appointment-shift.entity';
import Appointment from '../entities/appointment.entity';
import AppointmentCloses from '../entities/appointment-close.entity';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @IsNumber()
  @IsOptional()
  id: number;
}
export class UpdatedAppointmentWithShift {
  appointmentShift?: AppointmentShifts;
  appointmentShifts?: AppointmentShifts;
  appointment?: Appointment;
  appointmentCloses?: AppointmentCloses;
}
