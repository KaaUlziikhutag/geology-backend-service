import { NotFoundException } from '@nestjs/common';

class AgreeByuserNotFoundException extends NotFoundException {
  constructor(agreeByuserId: number) {
    super(`AgreeByuser with id ${agreeByuserId} not found`);
  }
}

export default AgreeByuserNotFoundException;
