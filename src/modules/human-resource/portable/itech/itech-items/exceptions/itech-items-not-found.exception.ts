import { NotFoundException } from '@nestjs/common';

class ItechItemNotFoundException extends NotFoundException {
  constructor(ItechItemId: number) {
    super(`ItechItem with id ${ItechItemId} not found`);
  }
}

export default ItechItemNotFoundException;
