import { NotFoundException } from '@nestjs/common';

class VoteQuestionNotFoundException extends NotFoundException {
  constructor(questionId: number) {
    super(`Public vote question  with id ${questionId} not found`);
  }
}

export default VoteQuestionNotFoundException;
