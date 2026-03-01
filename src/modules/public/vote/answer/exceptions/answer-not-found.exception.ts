import { NotFoundException } from '@nestjs/common';

class VoteAnswerNotFoundException extends NotFoundException {
  constructor(answerId: number) {
    super(`Public vote question answer  with id ${answerId} not found`);
  }
}

export default VoteAnswerNotFoundException;
