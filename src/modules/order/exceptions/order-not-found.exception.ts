import { NotFoundException } from '@nestjs/common';

export default class OrderNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Order with id: ${id} not found`);
  }
}
