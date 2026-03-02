import { NotFoundException } from '@nestjs/common';

class ViewUserNotFoundException extends NotFoundException {
  constructor() {
    super(`Decision View User Not Found`);
  }
}

export default ViewUserNotFoundException;
