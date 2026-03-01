import { NotFoundException } from '@nestjs/common';

class ContactNotFoundException extends NotFoundException {
  constructor(contactId: number) {
    super(`Contact with id ${contactId} not found`);
  }
}

export default ContactNotFoundException;
