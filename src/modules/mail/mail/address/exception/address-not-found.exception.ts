import { NotFoundException } from '@nestjs/common';

class AddressNotFoundException extends NotFoundException {
  constructor() {
    super(`Address Not Found`);
  }
}

export default AddressNotFoundException;
