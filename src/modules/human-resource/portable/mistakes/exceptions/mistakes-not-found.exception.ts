import { NotFoundException } from '@nestjs/common';

class MistakesNotFoundException extends NotFoundException {
  constructor(mistakesId: number) {
    super(`Mistakes with id ${mistakesId} not found`);
  }
}

export default MistakesNotFoundException;
