import { NotFoundException } from '@nestjs/common';

class ViewUserNotFoundException extends NotFoundException {
  constructor() {
    super(`Signature View User Not Found`);
  }
}

export default ViewUserNotFoundException;
