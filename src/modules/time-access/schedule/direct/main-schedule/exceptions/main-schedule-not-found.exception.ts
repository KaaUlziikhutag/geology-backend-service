import { NotFoundException } from '@nestjs/common';

class MainScheduleNotFoundException extends NotFoundException {
  constructor(mainScheduleId: number) {
    super(`MainSchedule with id ${mainScheduleId} not found`);
  }
}

export default MainScheduleNotFoundException;
