import { NotFoundException } from '@nestjs/common';

class StateNotFoundException extends NotFoundException {
  constructor(stateId: number) {
    super(`State with id ${stateId} not found`);
  }
}

export default StateNotFoundException;
