import { NotFoundException } from '@nestjs/common';

class ConnectionUserNotFoundException extends NotFoundException {
  constructor() {
    super(`Connection User Not Found`);
  }
}

export default ConnectionUserNotFoundException;
