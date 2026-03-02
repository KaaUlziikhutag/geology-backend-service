import { NotFoundException } from '@nestjs/common';

class DelegateOutNotFoundException extends NotFoundException {
  constructor() {
    super(`Contract Delegate Out Not Found`);
  }
}

export default DelegateOutNotFoundException;
