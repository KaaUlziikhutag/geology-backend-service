import { NotFoundException } from '@nestjs/common';

class AboveNotFoundException extends NotFoundException {
  constructor(aboveId: number) {
    super(`Above with id ${aboveId} not found`);
  }
}

export default AboveNotFoundException;
