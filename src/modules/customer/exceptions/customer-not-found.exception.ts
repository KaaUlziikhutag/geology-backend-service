import { NotFoundException } from '@nestjs/common';

export default class CustomerNotFoundException extends NotFoundException {
  constructor(by: number | string) {
    super(`Customer with by: ${by} not found`);
  }
}
