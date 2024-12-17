import { NotFoundException } from '@nestjs/common';

export default class ContractNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Contract with id: ${id} not found`);
  }
}
