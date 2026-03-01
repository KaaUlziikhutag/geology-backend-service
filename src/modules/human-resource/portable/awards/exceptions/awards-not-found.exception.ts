import { NotFoundException } from '@nestjs/common';

class AwardNotFoundException extends NotFoundException {
  constructor(awardId: number) {
    super(`Award with id ${awardId} not found`);
  }
}

export default AwardNotFoundException;
