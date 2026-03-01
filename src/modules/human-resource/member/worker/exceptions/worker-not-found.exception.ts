import { NotFoundException } from '@nestjs/common';

class WorkerNotFoundException extends NotFoundException {
  constructor(workerId: number) {
    super(`Worker with id ${workerId} not found`);
  }
}

export default WorkerNotFoundException;
