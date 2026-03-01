import { NotFoundException } from '@nestjs/common';

class HomesNotFoundException extends NotFoundException {
  constructor(homesId: number) {
    super(`Homes with id ${homesId} not found`);
  }
}

export default HomesNotFoundException;
