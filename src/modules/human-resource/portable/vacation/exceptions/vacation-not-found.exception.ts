import { NotFoundException } from '@nestjs/common';

class VacationNotFoundException extends NotFoundException {
  constructor(vacationId: number) {
    super(`Vacation with id ${vacationId} not found`);
  }
}

export default VacationNotFoundException;
