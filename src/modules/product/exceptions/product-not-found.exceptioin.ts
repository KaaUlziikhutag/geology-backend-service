import { NotFoundException } from '@nestjs/common';

export default class ProductNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Product with id ${id} not found`);
  }
}
