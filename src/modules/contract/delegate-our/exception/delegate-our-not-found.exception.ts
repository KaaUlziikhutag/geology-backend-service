import { NotFoundException } from '@nestjs/common';

class DelegateOurNotFoundException extends NotFoundException {
  constructor() {
    super(`Contract Delegate Our Not Found`);
  }
}

export default DelegateOurNotFoundException;
