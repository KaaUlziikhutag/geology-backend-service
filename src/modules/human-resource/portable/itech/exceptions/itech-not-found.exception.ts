import { NotFoundException } from '@nestjs/common';

class ItechNotFoundException extends NotFoundException {
  constructor(itechId: number) {
    super(`Itech with id ${itechId} not found`);
  }
}

export default ItechNotFoundException;
