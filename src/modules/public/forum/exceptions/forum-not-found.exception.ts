import { NotFoundException } from '@nestjs/common';

class PublicForumNotFoundException extends NotFoundException {
  constructor(forumId: number) {
    super(`Public forum with id ${forumId} not found`);
  }
}

export default PublicForumNotFoundException;
