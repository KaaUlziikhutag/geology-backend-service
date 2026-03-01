import { NotFoundException } from '@nestjs/common';

class ExcuseNotFoundException extends NotFoundException {
  constructor(excuseId: number) {
    super(`Excuse with id ${excuseId} not found`);
  }
}

export default ExcuseNotFoundException;
