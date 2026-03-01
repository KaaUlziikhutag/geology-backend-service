import { NotFoundException } from '@nestjs/common';

class SoldiersNotFoundException extends NotFoundException {
  constructor(SoldiersId: number) {
    super(`Soldiers with id ${SoldiersId} not found`);
  }
}

export default SoldiersNotFoundException;
