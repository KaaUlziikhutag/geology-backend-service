import { NotFoundException } from '@nestjs/common';

class DescriptionNotFoundException extends NotFoundException {
  constructor(descriptionId: number) {
    super(`Description with id ${descriptionId} not found`);
  }
}

export default DescriptionNotFoundException;
