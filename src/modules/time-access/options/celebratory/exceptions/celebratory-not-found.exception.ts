import { NotFoundException } from '@nestjs/common';

class CelebratoryNotFoundException extends NotFoundException {
  constructor(CelebratoryId: number) {
    super(`Celebratory with id ${CelebratoryId} not found`);
  }
}

export default CelebratoryNotFoundException;
