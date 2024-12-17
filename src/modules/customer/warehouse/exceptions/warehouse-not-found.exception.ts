import { NotFoundException } from '@nestjs/common';

export default class WarehouseNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Warehouse with id: ${id} not found`);
  }
}
