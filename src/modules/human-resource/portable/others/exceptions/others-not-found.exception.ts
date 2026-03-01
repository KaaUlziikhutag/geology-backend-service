import { NotFoundException } from '@nestjs/common';

class OthersNotFoundException extends NotFoundException {
  constructor(othersId: number) {
    super(`Others with id ${othersId} not found`);
  }
}

export default OthersNotFoundException;
