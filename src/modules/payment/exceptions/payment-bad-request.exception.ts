import { BadRequestException } from '@nestjs/common';

export default class PaymentBadRequestException extends BadRequestException {
  constructor(error: string) {
    super(`Payment error: ${error}`);
  }
}
