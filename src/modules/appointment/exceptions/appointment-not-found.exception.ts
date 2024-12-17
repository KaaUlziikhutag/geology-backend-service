import { NotFoundException } from '@nestjs/common';

export default class AppointmentNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Appointment with id: ${id} not found`);
  }
}
