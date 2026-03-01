import { NotFoundException } from '@nestjs/common';

class UserNotFoundException extends NotFoundException {
  constructor() {
    super(`Mail User Not Found`);
  }
}

export default UserNotFoundException;
