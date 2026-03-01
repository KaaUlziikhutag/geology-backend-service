import { NotFoundException } from '@nestjs/common';

class PublicVoteNotFoundException extends NotFoundException {
  constructor(galleryId: number) {
    super(`Public gallery with id ${galleryId} not found`);
  }
}

export default PublicVoteNotFoundException;
