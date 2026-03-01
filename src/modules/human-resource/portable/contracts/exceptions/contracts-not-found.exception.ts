import { NotFoundException } from '@nestjs/common';

class ContractNotFoundException extends NotFoundException {
  constructor(contractId: number) {
    super(`Contract with id ${contractId} not found`);
  }
}

export default ContractNotFoundException;
