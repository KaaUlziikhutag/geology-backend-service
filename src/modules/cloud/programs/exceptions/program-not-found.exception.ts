import { NotFoundException } from '@nestjs/common';

class ProgramNotFoundException extends NotFoundException {
  constructor(programId: number) {
    super(`Program with id ${programId} not found`);
  }
}

export default ProgramNotFoundException;
