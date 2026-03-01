import { NotFoundException } from '@nestjs/common';

class DisabledNotFoundException extends NotFoundException {
  constructor(DisabledId: number) {
    super(`Disabled with id ${DisabledId} not found`);
  }
}

export default DisabledNotFoundException;
