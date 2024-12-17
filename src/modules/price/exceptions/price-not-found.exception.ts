import { NotFoundException } from '@nestjs/common';

export default class PriceNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Price with id ${id} not found`);
  }
}
