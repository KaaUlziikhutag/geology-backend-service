import { NotFoundException } from '@nestjs/common';

class SignatureNotFoundException extends NotFoundException {
  constructor(mailId: number) {
    super(`System mail with id ${mailId} not found`);
  }
}

export default SignatureNotFoundException;
