import { NotFoundException } from '@nestjs/common';

class LegalActNotFoundException extends NotFoundException {
  constructor(LegalActId: number) {
    super(`LegalAct with id ${LegalActId} not found`);
  }
}

export default LegalActNotFoundException;
