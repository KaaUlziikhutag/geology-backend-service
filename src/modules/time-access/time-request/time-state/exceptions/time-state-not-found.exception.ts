import { NotFoundException } from '@nestjs/common';

class TimeStateNotFoundException extends NotFoundException {
  constructor(TimeStateId: number) {
    super(`TimeState with id ${TimeStateId} not found`);
  }
}

export default TimeStateNotFoundException;
