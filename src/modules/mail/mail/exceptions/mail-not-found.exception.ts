import { NotFoundException } from '@nestjs/common';

class MailNotFoundException extends NotFoundException {
  constructor(mailId: number) {
    super(`Mail with id ${mailId} not found`);
  }
}

export default MailNotFoundException;
