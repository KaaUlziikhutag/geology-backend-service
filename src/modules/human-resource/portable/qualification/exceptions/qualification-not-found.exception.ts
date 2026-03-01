import { NotFoundException } from '@nestjs/common';

class QualificationNotFoundException extends NotFoundException {
  constructor(qualificationId: number) {
    super(`Qualification with id ${qualificationId} not found`);
  }
}

export default QualificationNotFoundException;
