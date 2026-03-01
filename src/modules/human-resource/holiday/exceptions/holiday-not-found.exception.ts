import { NotFoundException } from '@nestjs/common';

class HolidayNotFoundException extends NotFoundException {
  constructor(holidayId: number) {
    super(`Holiday with id ${holidayId} not found`);
  }
}

export default HolidayNotFoundException;
