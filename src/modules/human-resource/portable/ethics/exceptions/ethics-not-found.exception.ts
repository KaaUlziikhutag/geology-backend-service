import { NotFoundException } from '@nestjs/common';

class EthicNotFoundException extends NotFoundException {
  constructor(ethicId: number) {
    super(`Ethic with id ${ethicId} not found`);
  }
}

export default EthicNotFoundException;
