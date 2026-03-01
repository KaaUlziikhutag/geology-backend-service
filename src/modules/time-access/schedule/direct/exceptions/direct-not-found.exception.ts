import { NotFoundException } from '@nestjs/common';

class DirectNotFoundException extends NotFoundException {
  constructor(directId: number) {
    super(`Direct with id ${directId} not found`);
  }
}

export default DirectNotFoundException;
