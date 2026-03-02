import { NotFoundException } from '@nestjs/common';

class InnerNotFoundException extends NotFoundException {
  constructor(docId: number) {
    super(`Inner with id ${docId} not found`);
  }
}

export default InnerNotFoundException;
