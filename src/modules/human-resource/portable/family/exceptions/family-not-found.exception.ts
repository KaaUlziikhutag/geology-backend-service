import { NotFoundException } from '@nestjs/common';

class FamilyNotFoundException extends NotFoundException {
  constructor(familyId: number) {
    super(`Family with id ${familyId} not found`);
  }
}

export default FamilyNotFoundException;
