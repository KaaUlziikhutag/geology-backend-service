import { NotFoundException } from '@nestjs/common';

class RepeatScheduleNotFoundException extends NotFoundException {
  constructor(repeatScheduleId: number) {
    super(`RepeatSchedule with id ${repeatScheduleId} not found`);
  }
}

export default RepeatScheduleNotFoundException;
