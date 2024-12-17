import { NotFoundException } from '@nestjs/common';

export default class MineralNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Mineral with id: ${id} not found`);
  }
}
