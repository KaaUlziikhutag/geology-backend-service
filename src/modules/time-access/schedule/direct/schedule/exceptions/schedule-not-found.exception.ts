import { NotFoundException } from '@nestjs/common';

class DirectScheduleNotFoundException extends NotFoundException {
  constructor(directScheduleId: number) {
    super(`DirectSchedule with id ${directScheduleId} not found`);
  }
}

export default DirectScheduleNotFoundException;
