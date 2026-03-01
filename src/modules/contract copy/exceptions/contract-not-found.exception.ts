import { NotFoundException } from '@nestjs/common';

class ContractNotFoundException extends NotFoundException {
  constructor(accessId: number) {
    super(`Contract with id ${accessId} not found`);
  }
}

export default ContractNotFoundException;
