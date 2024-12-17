import { NotFoundException } from '@nestjs/common';

export default class PaymentNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Payment with id ${id} not found`);
  }
}
