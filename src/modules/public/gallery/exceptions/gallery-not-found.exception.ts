import { NotFoundException } from '@nestjs/common';

class PublicGalleryNotFoundException extends NotFoundException {
  constructor(galleryId: number) {
    super(`Public gallery with id ${galleryId} not found`);
  }
}

export default PublicGalleryNotFoundException;
