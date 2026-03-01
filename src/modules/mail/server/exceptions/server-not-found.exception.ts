import { NotFoundException } from '@nestjs/common';

class ServerNotFoundException extends NotFoundException {
  constructor(mailId: number) {
    super(`System mail with id ${mailId} not found`);
  }
}

export default ServerNotFoundException;
