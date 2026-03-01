import { NotFoundException } from '@nestjs/common';

class EducationNotFoundException extends NotFoundException {
  constructor(educationId: number) {
    super(`Education with id ${educationId} not found`);
  }
}

export default EducationNotFoundException;
