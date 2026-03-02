import { NotFoundException } from '@nestjs/common';

class CustomerNotFoundException extends NotFoundException {
  constructor(customerId: number) {
    super(`Customer with id ${customerId} not found`);
  }
}

export default CustomerNotFoundException;
