import { NotFoundException } from '@nestjs/common';

class AppointmentNotFoundException extends NotFoundException {
  constructor(appointmentId: number) {
    super(`Appointment with id ${appointmentId} not found`);
  }
}

export default AppointmentNotFoundException;
