import { NotFoundException } from '@nestjs/common';

class AccessNotFoundException extends NotFoundException {
  constructor(accessId: number) {
    super(`Access with id ${accessId} not found`);
  }
}

export default AccessNotFoundException;
