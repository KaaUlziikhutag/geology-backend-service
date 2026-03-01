import { NotFoundException } from '@nestjs/common';

class PublicNewsNotFoundException extends NotFoundException {
  constructor(galleryId: number) {
    super(`Public news with id ${galleryId} not found`);
  }
}

export default PublicNewsNotFoundException;
