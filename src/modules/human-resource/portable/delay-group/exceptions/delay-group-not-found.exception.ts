import { NotFoundException } from '@nestjs/common';

class DelayGroupNotFoundException extends NotFoundException {
  constructor(delayGroupId: number) {
    super(`DelayGroup with id ${delayGroupId} not found`);
  }
}

export default DelayGroupNotFoundException;
