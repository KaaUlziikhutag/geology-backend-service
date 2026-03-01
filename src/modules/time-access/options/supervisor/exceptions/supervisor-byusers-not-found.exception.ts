import { NotFoundException } from '@nestjs/common';

class SupervisorByUsersNotFoundException extends NotFoundException {
  constructor(supervisorId: number) {
    super(`supervisorByUsers ip address ${supervisorId} not found`);
  }
}

export default SupervisorByUsersNotFoundException;
