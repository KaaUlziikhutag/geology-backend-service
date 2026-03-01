import { NotFoundException } from '@nestjs/common';

class TimeRequestNotFoundException extends NotFoundException {
  constructor(TimeRequestId: number) {
    super(`TimeRequest with id ${TimeRequestId} not found`);
  }
}

export default TimeRequestNotFoundException;
