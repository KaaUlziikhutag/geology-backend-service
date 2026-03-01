import { NotFoundException } from '@nestjs/common';

class PublicFileNotFoundException extends NotFoundException {
  constructor(fileId: number) {
    super(`Public File with id ${fileId} not found`);
  }
}

export default PublicFileNotFoundException;
