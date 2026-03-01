import { NotFoundException } from '@nestjs/common';

class ExperienceNotFoundException extends NotFoundException {
  constructor(experienceId: number) {
    super(`Experience with id ${experienceId} not found`);
  }
}

export default ExperienceNotFoundException;
