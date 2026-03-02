import { NotFoundException } from '@nestjs/common';

class TypeNotFoundException extends NotFoundException {
  constructor(typeId: number) {
    super(`Type with id ${typeId} not found`);
  }
}

export default TypeNotFoundException;
