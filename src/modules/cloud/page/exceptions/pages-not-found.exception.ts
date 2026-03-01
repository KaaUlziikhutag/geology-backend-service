import { NotFoundException } from '@nestjs/common';

class PagesNotFoundException extends NotFoundException {
  constructor(pagesId: number) {
    super(`Pages with id ${pagesId} not found`);
  }
}

export default PagesNotFoundException;
