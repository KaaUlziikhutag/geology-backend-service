import { NotFoundException } from '@nestjs/common';

class OptionNotFoundException extends NotFoundException {
  constructor(optionId: number) {
    super(`Option with id ${optionId} not found`);
  }
}

export default OptionNotFoundException;
