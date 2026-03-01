import { NotFoundException } from '@nestjs/common';

class DoctorNotFoundException extends NotFoundException {
  constructor(doctorId: number) {
    super(`Doctor with id ${doctorId} not found`);
  }
}

export default DoctorNotFoundException;
