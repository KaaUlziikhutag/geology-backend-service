import { NotFoundException } from '@nestjs/common';

class RepeatDetailNotFoundException extends NotFoundException {
  constructor(repeatDetailId: number) {
    super(`RepeatDetail with id ${repeatDetailId} not found`);
  }
}

export default RepeatDetailNotFoundException;
