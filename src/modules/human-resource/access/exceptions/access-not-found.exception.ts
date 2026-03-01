import { NotFoundException } from '@nestjs/common';

class AccessNotFoundException extends NotFoundException {
  constructor(AccessId: number) {
    super(`Access with id ${AccessId} not found`);
  }
}

export default AccessNotFoundException;
