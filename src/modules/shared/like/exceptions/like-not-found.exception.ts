import { NotFoundException } from '@nestjs/common';

class NewsLikeNotFoundException extends NotFoundException {
  constructor(answerId: number) {
    super(`Public news like with id ${answerId} not found`);
  }
}

export default NewsLikeNotFoundException;
