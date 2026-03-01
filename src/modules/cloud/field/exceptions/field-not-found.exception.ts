import { NotFoundException } from '@nestjs/common';

class FieldNotFoundException extends NotFoundException {
  constructor(FieldId: number) {
    super(`Field with id ${FieldId} not found`);
  }
}

export default FieldNotFoundException;
