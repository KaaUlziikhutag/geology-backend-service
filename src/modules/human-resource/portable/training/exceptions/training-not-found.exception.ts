import { NotFoundException } from '@nestjs/common';

class TrainingNotFoundException extends NotFoundException {
  constructor(trainingId: number) {
    super(`Training with id ${trainingId} not found`);
  }
}

export default TrainingNotFoundException;
