import { NotFoundException } from '@nestjs/common';

class ExchangeHumanNotFoundException extends NotFoundException {
  constructor(exchangeHumanId: number) {
    super(`ExchangeHuman with id ${exchangeHumanId} not found`);
  }
}

export default ExchangeHumanNotFoundException;
