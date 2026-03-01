import { NotFoundException } from '@nestjs/common';

class occupationNotFoundException extends NotFoundException {
  constructor(occupationId: number) {
    super(`occupation with id ${occupationId} not found`);
  }
}

export default occupationNotFoundException;
