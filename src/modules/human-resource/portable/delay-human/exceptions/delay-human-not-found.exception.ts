import { NotFoundException } from '@nestjs/common';

class DelayHumanNotFoundException extends NotFoundException {
  constructor(delayHumanId: number) {
    super(`DelayHuman with id ${delayHumanId} not found`);
  }
}

export default DelayHumanNotFoundException;
