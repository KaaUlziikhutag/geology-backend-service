import { NotFoundException } from '@nestjs/common';

class HumanNotFoundException extends NotFoundException {
  constructor(humanId: number) {
    super(`Human with id ${humanId} not found`);
  }
}

export default HumanNotFoundException;
