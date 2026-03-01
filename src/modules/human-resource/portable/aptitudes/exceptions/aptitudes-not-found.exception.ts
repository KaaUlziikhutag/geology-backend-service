import { NotFoundException } from '@nestjs/common';

class AptitudeNotFoundException extends NotFoundException {
  constructor(aptitudeId: number) {
    super(`Aptitude with id ${aptitudeId} not found`);
  }
}

export default AptitudeNotFoundException;
