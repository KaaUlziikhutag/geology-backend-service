import { NotFoundException } from '@nestjs/common';

class InnerTrainingNotFoundException extends NotFoundException {
  constructor(innerTrainingId: number) {
    super(`InnerTraining with id ${innerTrainingId} not found`);
  }
}

export default InnerTrainingNotFoundException;
