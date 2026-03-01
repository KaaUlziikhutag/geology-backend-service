import { NotFoundException } from '@nestjs/common';

class RepeatNotFoundException extends NotFoundException {
  constructor(repeatId: number) {
    super(`Repeat with id ${repeatId} not found`);
  }
}

export default RepeatNotFoundException;
