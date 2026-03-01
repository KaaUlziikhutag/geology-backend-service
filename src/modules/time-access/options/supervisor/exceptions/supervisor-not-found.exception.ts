import { NotFoundException } from '@nestjs/common';

class SupervisorNotFoundException extends NotFoundException {
  constructor(supervisorId: number) {
    super(`Supervisor with id ${supervisorId} not found`);
  }
}

export default SupervisorNotFoundException;
